Template.user.events({
    "change .active-user input": function (event) {
      console.log(event.target);


      Meteor.call('activeUser', this['_id'], function(err, isActive){
      	console.log("changed");
      	
      	var currUser = Session.get('totalUsers');
      	
      	if (isActive){
        	Session.set('totalUsers', currUser + 1);
      	} else {
        	Session.set('totalUsers', currUser - 1);
      	}

      });

    }
});
