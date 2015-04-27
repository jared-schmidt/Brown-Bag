if (Meteor.isClient) {

    Places = new Meteor.Collection("places");
    Orders = new Meteor.Collection("orders");
    Urls = new Meteor.Collection("urls");
    DesktopNotifications = new Meteor.Collection("desktopNotifications");
    Messages = new Meteor.Collection('messages');
    PastOrders = new Meteor.Collection('pastOrders');

    // Deps.autorun(function(){
    //     Meteor.subscribe('orders');
    //     Meteor.subscribe('places');
    //     Meteor.subscribe('urls');
    // });

    Deps.autorun(function() {
        Meteor.subscribe('messages');
        if(Meteor.Device.isDesktop()){
            Notification.requestPermission();
            Meteor.subscribe('desktopNotifications');
            Meteor.autosubscribe(function() {
                DesktopNotifications.find({}).observe({
                    added: function(notification) {
                        new Notification(notification.title, {
                            dir: 'auto',
                            lang: 'en-US',
                            body: notification.body,
                            icon: notification.icon
                        });
                    }
                });
            });
        }
    });

    $.material.init();

    Meteor.startup(function() {
        $.material.init();
    });
}
