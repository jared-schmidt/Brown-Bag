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

        },
        "change #side": function (event) {
          Meteor.call('changeLayout', this['_id'], event.target.value, function(err, isActive){
            toastr.success("Same old, Same old.", "Changed Layout!");
          });

        },
        "change #top": function(event){
            Meteor.call('changeLayout', this['_id'], event.target.value, function(err, isActive){
                toastr.success("Changing it up!", "Changed Layout!");
            });
        },
        "change #colorSelect": function(event){
            var newColor = $("#colorSelect option:selected").text();

            Meteor.call('changeColor', this['_id'], newColor, function(err){
                toastr.success("That looks real nice!", "Changed Color!");
            });

        }
    });

    Template.settings.helpers({
        selected: function(option){
            var color = Meteor.user().profile.color;
            if(color == option){
                return  'selected';
            }
            return '';
        }
    });

}
