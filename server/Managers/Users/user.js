if (Meteor.isServer) {
    Meteor.methods({
        changeOrderedFilter: function(state){
            var user = Meteor.user();
            if(user.hasOwnProperty('group')){
                var userGroup = Groups.findOne({'_id': user.group});
            }
            if (userGroup && userGroup.name.toLowerCase() !== 'johnstown'){
                throw new Meteor.Error(422, 'George the cat says NO!');
            }
          var me = Meteor.user();
          Meteor.users.update({'_id': me._id}, {$set:{'profile.order_filter': !state }});
        },
        activeUser: function(userid){
            var user = Meteor.user();
            if(user.hasOwnProperty('group')){
                var userGroup = Groups.findOne({'_id': user.group});
            }
            if (userGroup && userGroup.name.toLowerCase() !== 'johnstown'){
                throw new Meteor.Error(422, 'George the cat says NO!');
            }
            var me = Meteor.user();
            var user = Meteor.users.findOne(userid);

            if (me.roles === 'admin'){
                if (!user.profile.active){
                    console.log("true active");
                    Meteor.users.update({'_id':userid}, {$set:{'profile.active': true}});
                    return true;
                } else {
                    console.log("false active");
                    Meteor.users.update({'_id':userid}, {$set:{'profile.active': false}});
                    return false;
                }
            }
            throw new Meteor.Error(422, 'Must be an admin');
        }
    });
}
