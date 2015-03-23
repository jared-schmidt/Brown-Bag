if (Meteor.isClient) {

    Template.place.events({
        'click #delete': function(event){
            event.preventDefault();
            Meteor.call("removePlace", this._id, function(err){
                console.log("Removed?");
            });
        },
        'click #upvote': function(event){
            event.preventDefault();
            if(Meteor.userId()){
                $('#upvote').prop("disabled", true);
                Meteor.call("voteUp", this._id, function(err, data){
                    $('#upvote').prop("disabled", false);
                    Session.set('totalVotes', Session.get('totalVotes') + 1);
                    toastr.success("You make all the unicorns happpy!", "Voted!");
                });
            }
        },
        'click #resetVotes': function(event){
            event.preventDefault();
            if(Meteor.userId()){
                Meteor.call("resetVotes", this._id);
            }
        },
        'click #downVote': function () {
            event.preventDefault();
            $('#downVote').prop("disabled", true);
          var user = Meteor.user();
          if (user){
            Meteor.call("removeVote", this._id,function(err, data){
                $('#downVote').prop("disabled", false);
                Session.set('totalVotes', Session.get('totalVotes') - 1);
                toastr.error("You made the chupacabra mad!", "Unvoted!");

            });
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
        },
        'isWinner': function(){
            return Places.find({'winner': 1}).count() > 0;
        },
        'downVote': function(){
            var user = Meteor.user();
            if (user){
              return Places.find({ $and : [{'upvoters' : {"$in" : [user._id]}}, {'_id' : this._id}] }).count() > 0;
            }
            return false;
        },
        'voted': function(){
            var user = Meteor.user();
            if (user){
              return Places.find({'upvoters' : {"$in" : [user._id]}}).count() > 0;
            }
            return false;
        }
    });
}