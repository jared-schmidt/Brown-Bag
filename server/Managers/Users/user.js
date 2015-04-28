if (Meteor.isServer) {
    Meteor.methods({
        activeUser: function(userid){
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
