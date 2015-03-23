if (Meteor.isServer) {
    Meteor.methods({
        activeUser: function(userid){
            var user = Meteor.users.findOne(userid);

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
    });
}
