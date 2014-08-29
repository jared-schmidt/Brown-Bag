

if (Meteor.isServer) {
    Meteor.startup(function () {
        process.env.MAIL_URL="smtp://brown.bag.ps@gmail.com:GuessAgai@smtp.gmail.com:465/";
    });
}