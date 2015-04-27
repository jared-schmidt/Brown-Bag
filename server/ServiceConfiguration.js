isDevEnv = function () {
    console.log(process.env.ROOT_URL);
    if (String(process.env.ROOT_URL).indexOf("localhost") >= 0) {
        return true;
    } else {
        return false;
    }
};

isTestEnv = function(){
    console.log("test -> ", String(process.env.ROOT_URL).indexOf("bag.meteor") >= 0)
    if (String(process.env.ROOT_URL).indexOf("bag.meteor") >= 0){
        return true;
    }
    return false;
};

ServiceConfiguration.configurations.remove({
    service: 'google'
});


if (!isDevEnv() && !isTestEnv()) {
    console.log("Production");
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: Meteor.settings['google_prod_id'],
        secret: Meteor.settings['google_prod_secret']
    });
}
else if (!isDevEnv() && isTestEnv()){
    console.log("Test");
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: Meteor.settings['google_test_id'],
        secret: Meteor.settings['google_test_secret']
    });
}
else if(isDevEnv() && !isTestEnv()) {
    console.log("development");
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: Meteor.settings['google_dev_id'],
        secret: Meteor.settings['google_dev_secret']
    });
} else {
    console.log('isDev -> ', isDevEnv())
    console.log('isTest -> ', isTestEnv())
}
