if (Meteor.isClient) {

    Places = new Meteor.Collection("places");
    Orders = new Meteor.Collection("orders");
    Urls = new Meteor.Collection("urls");
    DesktopNotifications = new Meteor.Collection("desktopNotifications");
    Messages = new Meteor.Collection('messages');
    PastOrders = new Meteor.Collection('pastOrders');
    Groups = new Meteor.Collection('groups');
    // Topics = new Meteor.Collection('topics');

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

    Meteor.startup(function() {
        $.material.init();
    });
}
