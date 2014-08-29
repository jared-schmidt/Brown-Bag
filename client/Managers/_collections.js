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

    Meteor.startup(function(){

    });
}