
Template.layout.events({
    'click .closeMessage': function(){
        Meteor.call('userClosed', this._id, function(err){
            if (err){
                toastr.error(err.reason, "Error!");
            }
        });
    }
});

Template.layout.helpers({
    messages : function(){
        var user = Meteor.user();
        if (user){
          return Messages.find({'usersClosed' : {"$nin" : [user._id]}});
        }
        return Messages.find({});
    }
});
