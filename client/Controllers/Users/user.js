Template.user.events({
    "change .active-user input": function (event) {

      Meteor.call('activeUser', this['_id'], function(err, isActive){
      	console.log("changed");

      	var currUser = Session.get('totalUsers');

      	if (isActive){
        	Session.set('totalUsers', currUser + 1);
                toastr.success("They be like, aww yeah!", "User Active!");
      	} else {
        	Session.set('totalUsers', currUser - 1);
          toastr.error("They be like, aww no!", "User deactive");
      	}

      });

    }
});
