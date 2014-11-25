isProdEnv = function () {
    if (process.env.ROOT_URL == "http://localhost:3000") {
        return false;
    } else {
        return true;
    }
}

if (isProdEnv()) {
    // ServiceConfiguration.configurations.remove({
    //     service: 'google'
    // });

    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: Meteor.settings['google_prod_id'],
        secret: Meteor.settings['google_prod_secret']
    });
}
else {
    // dev environment
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: Meteor.settings['google_dev_id'],
        secret: Meteor.settings['google_dev_secret']
    });
}