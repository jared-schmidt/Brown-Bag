if (Meteor.isClient) {
    Template.settings.events({
        'click #confirmSlack':function(event){
            console.log('confirm Slack');
            event.preventDefault();

            var user = Meteor.user();
            if (!user){
                return;
            }
            console.log("Confirm clicked");
            Meteor.call("confirmSlack", user._id, function(error){
                console.log('confirming slack...');
                toastr.success("Yay! Here's a cookie!", "Confirmed!");
            });

        }
    });

}
