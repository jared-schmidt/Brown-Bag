isProdEnv = function () {
    if (process.env.ROOT_URL == "http://localhost:3000") {
        return false;
    } else {
        return true;
    }
}

ServiceConfiguration.configurations.remove({
    service: 'google'
});


if (isProdEnv()) {
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: '17949077904-dtilfr90jis1f102152g9nt9vn98efib.apps.googleusercontent.com',
        secret: 'wlTZaq7F99aupNJUbWNLJejX'
    });
} else {
    // dev environment
    ServiceConfiguration.configurations.insert({
        service: 'google',
        clientId: '17949077904-t60r068tglvu35tibt3f2eimfbnl89lb.apps.googleusercontent.com',
        secret: 'E6ioDj2BlNEKWzzkz-p2m9Uz'
    });
}
