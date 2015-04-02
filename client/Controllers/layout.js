if (Meteor.isClient) {

    Template.layout.events({
        'click .closeMessage': function(){
            console.log(this._id);
            Meteor.call('userClosed', this._id, function(){
                toastr.success("Message go bye-bye", "Closed message!");
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
}
