function parse(s){
    host = s.split("@");
    return host[1];
}

function inArray(value, array) {
  return array.indexOf(value) > -1;
}

Accounts.validateNewUser(function (user) {
    if(user.services.hasOwnProperty('google')){
        host = parse(user.services.google.email);

        if (host === Meteor.settings.emailDomin)
            return true;
        throw new Meteor.Error(403, "Must use " + Meteor.settings.emailDomin + " email!");
    }
    return true;
});

Accounts.onCreateUser(function(options, user){
    console.log(user);
    if(user.services.hasOwnProperty('google')){

        if (inArray(user.services.google.email, Meteor.settings.adminEmails)){
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

        user.profile = profile;

        user.profile.active = true;
        user.profile.layout = Meteor.settings.defaultLayout;
        user.profile.color = Meteor.settings.defaultColor;

    }
    return user;
});

Accounts.onLogin(function(user){
    user = user.user;
    // var userGroup = Groups.findOne({'_id': user.group});
    //
    // if (userGroup.name.toLowerCase() !== 'johnstown'){
    //     console.log("Can't let you log it!");
    // }

});
