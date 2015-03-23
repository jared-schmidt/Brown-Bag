if (Meteor.isClient) {

    Template.url.voted = function(){
        var user = Meteor.user();
        return Urls.find({'upvoters' : {"$in" : [user._id]}}).count() > 0;
    }

    Template.url.events({
        'click #delete': function(event){
            event.preventDefault();
            Urls.remove(this['_id']);
        },
        'click #upvote': function(event){
            event.preventDefault();
            if(Meteor.userId()){
                Meteor.call("upUrlVote", this._id);
            }
        },
        'click #resetVotes': function(event){
            event.preventDefault();
            if(Meteor.userId()){
                Meteor.call("resetUrlVotes", this._id);
            }
        },
        'click #did' :function(event){
            event.preventDefault();
            if(Meteor.userId()){
                Meteor.call("did", this._id);
            }
        }
    });

    Template.url.helpers({
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