if (Meteor.isServer) {
    Meteor.methods({
        upUrlVote : function(urlId){
            var user = Meteor.user();
            if (!user){
                throw new Meteor.Error(401, "You need to login to upvote");
            }

            var url = Urls.findOne(urlId);
            if (!url){
                throw new Meteor.Error(422, 'Url not found');
            }

            if (_.include(url.upvoters, user._id))
                throw new Meteor.Error(422, 'Already upvoted');

            Urls.update(url._id, {
                $addToSet: {'upvoters': user._id},
                $inc : {'votes':1}
            });
        },
        resetUrlVotes:function(urlId){
            Urls.update(urlId, {
                $set : {"upvoters" : [],'votes':0},
            });
        },
        did:function(id){
            Urls.update(id, {$set:{"did":true}});
        },
    });
}
