if (Meteor.isClient) {
    Places = new Meteor.Collection("places");
    Orders = new Meteor.Collection("orders");
    Urls = new Meteor.Collection("urls");

    // Deps.autorun(function(){
    //     Meteor.subscribe('orders');
    //     Meteor.subscribe('places');
    //     Meteor.subscribe('urls');
    // });
}