if (Meteor.isServer) {
    Meteor.methods({
        voteUp : function(placeId){
            var user = Meteor.user();
            var voted = false;

            if (!user){
                throw new Meteor.Error(401, "You need to login to upvote");
            }

            var place = Places.findOne(placeId);
            if (!place){
                throw new Meteor.Error(422, 'Place not found');
            }

            if (_.include(place.upvoters, user._id)){
                throw new Meteor.Error(422, 'Already upvoted');
            }

            var places = Places.find({}).fetch();

            for (var i=0;i<=places.length-1;i++){
                var p = places[i];
                for(var y=0;y<=p.upvoters.length-1;y++){
                    var v = p.upvoters[y];
                    if (v === user._id){
                        voted = true;
                        break;
                    }
                }
            }

            if (!voted){
                Places.update(place._id, {
                    $addToSet: {'upvoters': user._id},
                    $inc : {'votes':1}
                });
                Meteor.users.update(user._id, {
                    $set:{'voted': true, 'profile.active': true}
                });
            } else {
                throw new Meteor.Error(422, 'Already upvoted');
            }

            return true;
        },
        removeVote:function(id){
            var user = Meteor.user();

            var places = Places.find({}).fetch();
            var voted = false;

            for (var i=0;i<=places.length-1;i++){
                var p = places[i];
                for(var y=0;y<=p.upvoters.length-1;y++){
                    var v = p.upvoters[y];
                    if (v === user._id){
                        voted = p._id;
                        break;
                    }
                }
            }

            if (voted === id){
                Places.update({'_id':id}, {$inc: {votes: -1}, $pull: {'upvoters': user._id}});
                Meteor.users.update(user._id, {
                    $set:{'voted': false}
                });
                return true;
            }

            throw new Meteor.Error(422, 'That is not what you voted for.');
        },
        removePlace:function(placeid){
            Places.remove(placeid);
        },
    });
}
