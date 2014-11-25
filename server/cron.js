if (Meteor.isServer) {
    // 0 or 7 Sunday
    // 1 Monday
    // 2 Tuesday
    // 3 Wednesday
    // 4 Thursday
    // 5 Friday
    // 6 Saturday

/*
    field           allowed values
    ------          --------------
    second              0-59
    minute               0-59
    hour                 0-23
    day of month          0-31
    month                0-12 (or names, see below)
    day of week          0-7 (0 or 7 is Sun, or use names)
 */

    var c = CRON.createNewCronJob('00 00 9 * * 4', function () {
        var message = "http://brown-bag.meteor.com/";
        message = "Hello from brown-bag.meteor.com."
        slack_message(message);
    }, 'America/New_York');
    // on stop
    c.onStop(function () {
        console.log('stop');
    });
    c.run();



    function slack_message(message){
        var url = Meteor.settings['slack_in_url'];
        var payload = {
            "username": "Brown-Bag",
            "icon_emoji": ":hamburger:",
            "text": message
        }

        var result = Meteor.http.post(url,{
            data: payload
        });
    }

    // var sendMail = function(){
    //     // "0 10 * * 4" : sendMail
    //     var users_list = Meteor.users.find({}).fetch();
    //     var email_list = [];
    //     var message = "Ready for brown bag? http://brown-bag.meteor.com <br /> This is just a test email from http://brown-bag.meteor.com."
    //     for(var i=0;i<=users_list.length-1;i++){
    //         Meteor.call("sendEmail", users_list[i].profile.email, message, function(err){
    //             console.log("sent mail!");
    //         });
    //     }
    // };
}