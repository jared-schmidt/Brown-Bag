if (Meteor.isClient) {
    Places = new Meteor.Collection("places");
    Orders = new Meteor.Collection("orders");

    Deps.autorun(function(){
        Meteor.subscribe('orders');
        Meteor.subscribe('places');
    });
}