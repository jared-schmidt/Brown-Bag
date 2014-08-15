if (Meteor.isClient) {

    Template.place.voted = function(){
        var user = Meteor.user();
        return Places.find({'upvoters' : {"$in" : [user._id]}}).count() > 0;
    }

    Template.place.events({
        'click #delete': function(event){
            event.preventDefault();
            console.log("deleteing..." +this['_id'])
            Places.remove(this['_id']);
        },
        'click #upvote': function(event){
            event.preventDefault();
            if(Meteor.userId()){
                Session.set("selected_place", this._id);
                console.log(this);
                Meteor.call("voteUp", this._id);
            }
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