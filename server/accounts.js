function parse(s){
    host = s.split("@");
    return host[1];
}

Accounts.validateNewUser(function (user) {
    if(user.services.hasOwnProperty('google')){
        host = parse(user.services.google.email);

        if (host === "problemsolutions.net")
            return true;
        throw new Meteor.Error(403, "Must use problemsolutions.net email!");
    }
    return true;
});

Accounts.onCreateUser(function(options, user){
    console.log(user);
    if(user.services.hasOwnProperty('google')){
        if (user.services.google.email === 'jschmidt@problemsolutions.net' || user.services.google.email === 'ddollar@problemsolutions.net' || user.services.google.email === 'cscott@problemsolutions.net'){
            user.roles = 'admin';
        }
        else{
            user.roles = 'user';
        }

        var accessToken = user.services.google.accessToken, result, profile;

        result = Meteor.http.get("https://www.googleapis.com/oauth2/v3/userinfo",{
            headers:{"User-Agent": "Meteor/1.0"},
            params: {access_token: accessToken }
        });

        if (result.error)
            throw result.error;

        profile = _.pick(result.data,
        "name",
        "given_name",
        "family_name",
        "profile",
        "picture",
        "email",
        "email_verified",
        "birthdate",
        "gender",
        "locale",
        "hd");

        // console.log(profile);
        user.profile = profile;

        user.profile.active = true;
        user.profile.layout = "1";

    }
    return user;
});