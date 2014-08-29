if (Meteor.isClient) {
    Notification.requestPermission();
    Template.user_loggedout.events({
        'click #login': function(event, tmpl){
            Meteor.loginWithGoogle({
                requestPermissions:['email', 'profile']
            }, function(err){
                if (err){
                    alert('error : '+ err);
                    throw new Meteor.Error(Accounts.LoginCancelledError.numericError, 'Error');
                }
                else{
                    // something else
                }
            });
        }
    });

    Template.user_loggedin.events({
        "click #logout": function(event, tmpl) {
            Meteor.logout(function(err) {
                if(err) {
                    alert('error : '+ err);
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
            Meteor.call('publishNotification'); //TODO include time for N minutes until food order
            // return false;
        }
    });

    Meteor.subscribe('desktopNotifications', {
        added: function(notification){ 
            alert('WORKED');
            var n = new Notification(notification.title, {
                dir: 'auto',
                lang: 'en-US',
                body: notification.body,
                icon: notification.icon
            });
        }
    });
    Meteor.autosubscribe(function() {
        DesktopNotifications.find({}).observe({
            added: function(notification){ 
                var n = new Notification(notification.title, {
                    dir: 'auto',
                    lang: 'en-US',
                    body: notification.body,
                    icon: notification.icon
                });
            }
        });
    });
}