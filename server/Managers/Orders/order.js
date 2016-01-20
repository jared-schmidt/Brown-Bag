if (Meteor.isServer) {
    Meteor.methods({
        removeOrder : function(orderId){
            var user = Meteor.user();

            var user = Meteor.user();
            if(user.hasOwnProperty('group')){
                var userGroup = Groups.findOne({'_id': user.group});
            }
            if (userGroup && userGroup.name.toLowerCase() !== 'johnstown'){
                throw new Meteor.Error(422, 'George the cat says NO!');
            }

            Orders.remove(orderId);

            // Check if already Ordered
            var ordered = false;
            var orders = Orders.find({}).fetch();
            for (var i=0;i<=orders.length-1;i++){
                var o = orders[i];
                if (o.name === Meteor.user().profile.name){
                    ordered = true;
                    break;
                }
            }

            if (!ordered){
              Meteor.users.update(user._id,{
                  $set:{'ordered':false}
              });
            }
        },
        addOrder : function(name, food){
            if (!name){
                throw new Meteor.Error(422, 'Not logged in');
            }

            var user = Meteor.user();
            if(user.hasOwnProperty('group')){
                var userGroup = Groups.findOne({'_id': user.group});
            }
            if (userGroup && userGroup.name.toLowerCase() !== 'johnstown'){
                throw new Meteor.Error(422, 'George the cat says NO!');
            }
            if(!food){
                throw new Meteor.Error(422, 'No food order entered');
            }

            // Check if already Ordered
            var ordered = false;
            var orders = Orders.find({}).fetch();
            for (var i=0;i<=orders.length-1;i++){
                var o = orders[i];
                if (o.name === Meteor.user().profile.name){
                    ordered = true;
                    break;
                }
            }

            var orderId = Orders.insert({
                'name' : name,
                'food' : food,
                'submittedOn' : new Date()
            });

            var user = Meteor.user();
            Meteor.users.update(user._id, {
                $set:{'ordered': true, 'profile.active': true}
            });

            return {
                'id': orderId,
                'alreadyOrdered': ordered
            };
        },
        getTotalOrders: function(){
            var user = Meteor.user();
            if(user.hasOwnProperty('group')){
                var userGroup = Groups.findOne({'_id': user.group});
            }
            if (userGroup && userGroup.name.toLowerCase() !== 'johnstown'){
                throw new Meteor.Error(422, 'George the cat says NO!');
            }

            return Orders.find({}).count();
        },
    });
}
