if (Meteor.isClient) {
    Notification.requestPermission();
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


    Template.header.events({
        'click #send-notification': function(event, template) {
            //TODO include time for N minutes until food order
            Meteor.call('publishNotification', {
                title: 'Orders Being Placed',
                body: 'The food is being ordered soon, please make sure your order is in.',
                icon: 'brown-bag.png'
            });
            return false;
        },
        'click #menu-toggle': function(e) {
            e.preventDefault();
            console.log("here");
            $("#wrapper").toggleClass("toggled");
        },
        'click #endVoting': function(event) {
            event.preventDefault();
            console.log("ending voting...");
            Meteor.call("endPlaceVoting", function(err, placeId) {
                if (err)
                    console.log(err);
                console.log(placeId);
            });
        }
    });

    Meteor.subscribe('desktopNotifications');
    Meteor.autosubscribe(function() {
        DesktopNotifications.find({}).observe({
            added: function(notification) {
                new Notification(notification.title, {
                    dir: 'auto',
                    lang: 'en-US',
                    body: notification.body,
                    icon: notification.icon
                });
            }
        });
    });



}
