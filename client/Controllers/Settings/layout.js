Template.Layout.events({
    "change #side": function (event) {
      Meteor.call('changeLayout', this.user._id, event.target.value, function(err, isActive){
        if (err){
            console.error(err);
            toastr.error(err.reason, "Error!");
        }
      });

    },
    "change #top": function(event){
        Meteor.call('changeLayout', this.user._id, event.target.value, function(err, isActive){
          if (err){
              console.error(err);
              toastr.error(err.reason, "Error!");
          }
        });
    },
    "change #colorSelect": function(event){
        var newColor = $("#colorSelect option:selected").text();
        Meteor.call('changeColor', this.user._id, newColor, function(err){
          if (err){
              console.error(err);
              toastr.error(err.reason, "Error!");
          }
        });

    }
});

Template.Layout.helpers({
    selected: function(option){
        var color = Meteor.user().profile.color;
        if(color == option){
            return  'selected';
        }
        return '';
    }
});
