isProdEnv = function () {
    console.log(process.env.ROOT_URL);
    if (String(process.env.ROOT_URL).indexOf("localhost") >= 0) {
        return false;
    } else {
        return true;
    }
};

ServiceConfiguration.configurations.remove({
    service: 'google'
});


if (isProdEnv()) {
    console.log("Production");
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: Meteor.settings['google_prod_id'],
        secret: Meteor.settings['google_prod_secret']
    });
}
else {
    console.log("development");
    // dev environment
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: Meteor.settings['google_dev_id'],
        secret: Meteor.settings['google_dev_secret']
    });
}