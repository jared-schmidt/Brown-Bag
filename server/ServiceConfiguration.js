isDevEnv = function () {
    if (String(process.env.ROOT_URL).indexOf("localhost") >= 0) {
        return true;
    } else {
        return false;
    }
};

isTestEnv = function(){
    if (String(process.env.ROOT_URL).indexOf(Meteor.settings.test_host_url) >= 0){
        return true;
    }
    return false;
};

ServiceConfiguration.configurations.remove({
    service: 'google'
});


if (!isDevEnv() && !isTestEnv()) {
    console.log("ENV -> Production");
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: Meteor.settings['google_prod_id'],
        secret: Meteor.settings['google_prod_secret']
    });
}
else if (!isDevEnv() && isTestEnv()){
    console.log("ENV -> Test");
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: Meteor.settings['google_test_id'],
        secret: Meteor.settings['google_test_secret']
    });
}
else if(isDevEnv() && !isTestEnv()) {
    console.log("ENV -> Development (local)");
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: Meteor.settings['google_dev_id'],
        secret: Meteor.settings['google_dev_secret']
    });
} else {
    console.log('isDev -> ', isDevEnv());
    console.log('isTest -> ', isTestEnv());
    console.error("ENV -> DID NOT SETUP A SERVICECONFIGURATION");
}
