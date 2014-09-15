if (Meteor.isClient) {

    Template.place.voted = function(){
        var user = Meteor.user();
        if (user){
          return Places.find({'upvoters' : {"$in" : [user._id]}}).count() > 0;
        }
        return false;
    }

    Template.place.downVote = function(){
        var user = Meteor.user();
        if (user){
          return Places.find({ $and : [{'upvoters' : {"$in" : [user._id]}}, {'_id' : this._id}] }).count() > 0;
        }
        return false;
    }

    Template.place.isWinner = function(){
        return Places.find({'winner': 1}).count() > 0;
    }

    Template.place.events({
        'click #delete': function(event){
            event.preventDefault();
            Places.remove(this['_id']);
        },
        'click #upvote': function(event){
            event.preventDefault();
            if(Meteor.userId()){
                Meteor.call("voteUp", this._id);
            }
        },
        'click #resetVotes': function(event){
            event.preventDefault();
            if(Meteor.userId()){
                Meteor.call("resetVotes", this._id);
            }
        },
        'click .decrement': function () {
          var user = Meteor.user();
          if (user){
            Meteor.call("removeVote", this._id)
          }
          return false;
        }
    });

    Template.place.helpers({
        upvotedClass:function(){
            var userId = Meteor.userId();
            if (userId && !_.include(this.upvoters, userId)){
                return 'btn-success upvotable';
            }
            else{
                return 'disabled';
            }
        },
        downvotedClass:function(){
            var userId = Meteor.userId();
            if (userId && !_.include(this.upvoters, userId)){
                return 'btn-success upvotable';
            }
            else{
                return 'disabled';
            }
        }
    });
}