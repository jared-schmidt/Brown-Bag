Meteor.methods({
    getTotalVotesTopics: function(){
        var totalVotes = 0;
        Topics.find({}).map(function(doc){
            totalVotes += doc.votes;
        });
        return totalVotes;
    },
    addTopic : function(username, name, url){
        if (name){
            var topicId = Topics.insert({
                'username' : username,
                'name' : name,
                'votes': 0,
                'upvoters': [],
                'url': url,
                'submittedOn' : new Date()
            });
            return topicId;
        }
        throw new Meteor.Error(422, 'Name missing.');
    },
    voteUpTopic : function(topicId){
        var user = Meteor.user();
        var voted = false;

        if (!user){
            throw new Meteor.Error(401, "You need to login to upvote");
        }

        var topic = Topics.findOne(topicId);
        if (!topic){
            throw new Meteor.Error(422, 'topic not found');
        }

        if (_.include(topic.upvoters, user._id)){
            throw new Meteor.Error(422, 'Already upvoted');
        }

        var topics = Topics.find({}).fetch();

        for (var i=0;i<=topics.length-1;i++){
            var p = topics[i];
            for(var y=0;y<=p.upvoters.length-1;y++){
                var v = p.upvoters[y];
                if (v === user._id){
                    voted = true;
                    break;
                }
            }
        }

        if (!voted){
            Topics.update(topic._id, {
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
    removeVoteTopic:function(id){
        var user = Meteor.user();

        var topics = Topics.find({}).fetch();
        var voted = false;

        for (var i=0;i<=topics.length-1;i++){
            var p = topics[i];
            for(var y=0;y<=p.upvoters.length-1;y++){
                var v = p.upvoters[y];
                if (v === user._id){
                    voted = p._id;
                    break;
                }
            }
        }

        if (voted === id){
            Topics.update({'_id':id}, {$inc: {votes: -1}, $pull: {'upvoters': user._id}});
            Meteor.users.update(user._id, {
                $set:{'voted': false}
            });
            return true;
        }

        throw new Meteor.Error(422, 'That is not what you voted for.');
    },
    removeTopic:function(topicid){
        Topics.remove(topicid);
    },
    endVotingTopics: function(){
        topic = Topics.findOne({},{sort:{'votes': -1}});
        Topics.update(topic._id,{$set: {"winner": 1}});

        // console.log("End Voting...");
        var message = "Voting has ended! The winner is " + topic.name;

        slackMessage(message);

        return topic._id;
    },
    topicReset: function(){
        console.log("RESERT TOPIC")
        var winner = Topics.find({'winner': 1}).fetch();

        console.log(winner[0]);

        if (winner[0]){
            PastTopics.insert(winner[0]);
            Topics.remove(winner[0]._id);
        }

        Topics.find().forEach(function(place){
            Topics.update(place._id,{
                $set : {"upvoters" : [],'votes':0, 'winner': 0}
            });
        });
    }
});
