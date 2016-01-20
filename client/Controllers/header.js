Template.frontPage.events({
    'click #login': function(event, tmpl) {
        Meteor.loginWithGoogle({
            requestPermissions: ['email', 'profile']
        }, function(err) {
            if (err) {
                alert('error : ' + err);
                throw new Meteor.Error(Accounts.LoginCancelledError.numericError, 'Error');
            } else {
                // something else
            }
        });
    }
});

Template.user_loggedout.events({
    'click #login': function(event, tmpl) {
        Meteor.loginWithGoogle({
            requestPermissions: ['email', 'profile']
        }, function(err) {
            if (err) {
                alert('error : ' + err);
                throw new Meteor.Error(Accounts.LoginCancelledError.numericError, 'Error');
            } else {
                // something else
            }
        });
    }
});

Template.user_loggedin.events({
    "click #logout": function(event, tmpl) {
        Meteor.logout(function(err) {
            if (err) {
                alert('error : ' + err);
                throw new Meteor.Error(Accounts.LoginCancelledError.numericError, 'Error');
            } else {
                //show alert that says logged out
                //alert('logged out');
            }
        });
    }
});

Template.header.helpers({
    'layout': function(){
        if (Meteor.userId()) {
            return Meteor.user().profile.layout;
        }
        return 0;
    },
    activeIfTemplateIs: function (template) {
      var currentRoute = Router.current();
      return currentRoute &&
        template === currentRoute.lookupTemplate() ? 'active' : '';
    },
    'layoutColor':function(){
        if (Meteor.userId()) {
            if (Meteor.user().profile.color){
                return Meteor.user().profile.color.toLowerCase();
            } else {
                return 'brown';
            }
        }
        return 'brown';
    }
});

Template.header.events({
    'click #send-notification': function(event, template) {
        //TODO include time for N minutes until food order
        var message = "The food is being ordered soon, please make sure your order is in.";

        Meteor.call('publishNotification', {
            title: 'Orders Being Placed',
            body: message,
            icon: 'brown-bag.png'
        });


        Meteor.call('slack_message', message,function(err){
            if(err){
                console.log(err);
            }
        });
        return false;
    },
    'click #menu-toggle': function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    },
    'click a':function(e){
        $("#wrapper").removeClass("toggled");
    },
    'click #vote-notify': function(e){
        e.preventDefault();
        Meteor.call('vote_Notification');
    },
    // 'click #endOrdering':function(event){
    //     Meteor.call('endOrdering');
    // },
    'click #endVoting': function(event) {
        event.preventDefault();

        bootbox.dialog({
            message: "This can not be undone until the whole site is reset.",
            title : "Are you sure?!?!",
            buttons:{
                danger:{
                    label: "Yes!",
                    className:"btn-danger",
                    callback: function(){
                        console.log("ending voting...");
                        Meteor.call("endPlaceVoting", function(err, placeId) {
                            if (err)
                                console.log(err);
                            console.log(placeId);
                        });
                    }
                },
                main:{
                    label: "No!",
                    className: "btn-primary",
                    callback: function(){
                    }
                }
            }
        });
    },
    'click #currentStandings': function(event){
        Meteor.call('currectStandings');
    },
    'click #endVotingTopics': function(event){
        event.preventDefault();

        bootbox.dialog({
            message: "This can not be undone until the whole site is reset.",
            title : "Are you sure?!?!",
            buttons:{
                danger:{
                    label: "Yes!",
                    className:"btn-danger",
                    callback: function(){
                        console.log("ending voting...");
                        Meteor.call("endVotingTopics", function(err, topicId) {
                            if (err)
                                console.log(err);
                            console.log(topicId);
                        });
                    }
                },
                main:{
                    label: "No!",
                    className: "btn-primary",
                    callback: function(){
                    }
                }
            }
        });
    }
});

Template.clearAll.events({
    'click #saveClear': function(event){
        console.log("Clear");
        bootbox.dialog({
            message: "This will reset the site, clearing votes and orders!",
            title : "Are you sure?!?!",
            buttons:{
                danger:{
                    label: "Yes!",
                    className:"btn-danger",
                    callback: function(){
                        Meteor.call("clearAll", function(err){
                            if (err){
                                console.error(err);
                                toastr.error(err.reason, "Error!");
                            }
                        });
                    }
                },
                main:{
                    label: "No!",
                    className: "btn-primary",
                    callback: function(){
                    }
                }
            }
        });
    },
    'click #topicReset': function(event){
        console.log("reset topics");
        bootbox.dialog({
            message: "This will reset the topic voting",
            title : "Are you sure?!?!",
            buttons:{
                danger:{
                    label: "Yes!",
                    className:"btn-danger",
                    callback: function(){
                        Meteor.call("topicReset", function(err){
                            if (err){
                                console.error(err);
                                toastr.error(err.reason, "Error!");
                            }
                        });
                    }
                },
                main:{
                    label: "No!",
                    className: "btn-primary",
                    callback: function(){
                    }
                }
            }
        });
    }
});
