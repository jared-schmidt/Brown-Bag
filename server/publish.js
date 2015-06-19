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

    Meteor.publish('winnerPlace', function(){
        return Places.find({'winner': 1}, {fields: {'votes': 0}});
    });

    Meteor.publish('urls', function(){
        return Urls.find({});
    });

    Meteor.publish("userData", function(){
        return Meteor.users.find({}, {fields: {
            'profile': 1,
            'roles': 1,
            'voted': 1,
            'ordered': 1,
            'group': 1
        }});
    });

    // Publish data for single user "Meteor.user()"
    Meteor.publish(null, function() {
        return Meteor.users.find({_id: this.userId}, {fields: {
            'group': 1,
            'profile': 1,
            'roles': 1,
            'voted': 1,
            'ordered': 1
        }});
    });

    Meteor.publish('messages', function(){
        return Messages.find({});
    });

    Meteor.publish('pastOrders', function(){
        return PastOrders.find({});
    });

    Meteor.publish('groups', function(){
        return Groups.find({});
    });

}
