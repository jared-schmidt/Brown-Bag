isDevEnv = function () {
    var rv = false
    if (String(process.env.ROOT_URL).indexOf("localhost") >= 0) {
        rv = true;
    }
    console.log("isDev -> ", rv);
    return rv
};

isTestEnv = function(){
    var rv = false
    if (String(process.env.ROOT_URL).indexOf("http://bag.meteor.com") >= 0){
        rv = true;
    }
    console.log("isTest -> ", rv);
    return rv;
};

isProdEnv = function(){
    var rv = false
    if (String(process.env.ROOT_URL).indexOf("ps-brownbag.herokuapp.com") >= 0){
        rv = true;
    } else if (String(process.env.ROOT_URL).indexOf("http://brown-bag-pitt.meteor.com") >= 0){
        rv = true;
    }
    console.log("isProd -> ", rv);
    return rv;
}

ServiceConfiguration.configurations.remove({
    service: 'google'
});


if (isProdEnv()) {
    console.log("ENV -> Production");
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: Meteor.settings['google_prod_id'],
        secret: Meteor.settings['google_prod_secret']
    });
}
else if (isTestEnv()){
    console.log("ENV -> Test");
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: Meteor.settings['google_test_id'],
        secret: Meteor.settings['google_test_secret']
    });
}
else if(isDevEnv()) {
    console.log("ENV -> Development (local)");
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: Meteor.settings['google_dev_id'],
        secret: Meteor.settings['google_dev_secret']
    });
} else {
    // console.log('isDev -> ', isDevEnv());
    // console.log('isTest -> ', isTestEnv());
    console.error("ENV -> DID NOT SETUP A SERVICECONFIGURATION");
}
