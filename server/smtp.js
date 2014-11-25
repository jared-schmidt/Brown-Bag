if (Meteor.isServer) {
    Meteor.startup(function () {
        process.env.MAIL_URL=Meteor.settings['smtp_url'];
    });
}