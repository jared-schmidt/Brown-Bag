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
            var notification = new Notification('Place Your Order', {
                dir: 'auto',
                lang: 'en-US',
                body: 'The food is being ordered soon, please make sure your order is in.',
                icon: 'static/brown-bag.png'
            });
            return false;
        }
    });
}