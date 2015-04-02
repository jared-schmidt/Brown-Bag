if (Meteor.isServer) {

    Houston.add_collection(Meteor.users);
    Houston.add_collection(Houston._admins);

    Meteor.publish("desktopNotifications", function(){
        return DesktopNotifications.find({});
    });

    Meteor.publish('orders', function(){
        return Orders.find({});
    });

    Meteor.publish('places', function(){
        return Places.find({}, {fields: {'votes': 0}});
    });

    Meteor.publish('urls', function(){
        return Urls.find({});
    });

    Meteor.publish("userData", function(){
        return Meteor.users.find({}, {fields: {'profile': 1, 'roles': 1, 'voted': 1}});
    });

    Meteor.publish('messages', function(){
        return Messages.find({});
    });
}
