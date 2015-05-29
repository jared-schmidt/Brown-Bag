Template.Api.events({
    'click #confirmSlack':function(event){
        event.preventDefault();

        var user = Meteor.user();

        if (!user){
            return;
        }

        Meteor.call("confirmSlack", user._id, function(err){
          if (err){
              console.error(err);
              toastr.error(err.reason, "Error!");
          }
        });
    }
});
