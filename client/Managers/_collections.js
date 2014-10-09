if (Meteor.isClient) {
    Places = new Meteor.Collection("places");
    Orders = new Meteor.Collection("orders");
    Urls = new Meteor.Collection("urls");
    DesktopNotifications = new Meteor.Collection("desktopNotifications");

    // Deps.autorun(function(){
    //     Meteor.subscribe('orders');
    //     Meteor.subscribe('places');
    //     Meteor.subscribe('urls');
    // });

    Deps.autorun(function() {
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

    });
}
