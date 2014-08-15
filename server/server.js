Orders = new Meteor.Collection("orders");
Places = new Meteor.Collection("places");

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

function parse(s){
    host = s.split("@");
    return host[1];
}

Accounts.validateNewUser(function (user) {
    host = parse(user.services.google.email);

    if (host === "problemsolutions.net")
        return true;
    throw new Meteor.Error(403, "Must use problemsolutions.net email!");
});

Accounts.onCreateUser(function(options, user){
    if (user.services.google.email === 'jschmidt@problemsolutions.net' || user.services.google.email === 'ddollar@problemsolutions.net'){
        user.roles = 'admin'
    }
    else{
        user.roles = 'user'
    }
    user.profile = options.profile;
    return user;
});


if (Meteor.isServer) {

    Meteor.startup(function (){
        // code to run on server at startup
        if (Places.find().count() === 0){
            var places_data = [
                {'name':'The Press', 'url':'http://www.pressbistro.com/lunch-menu.html'},
                {"name":"Pappy's", 'url':""}
            ]
            for(var i=0; i <= places_data.length-1;i++){
                Places.insert({
                    'username' : 'init',
                    'name' : places_data[i].name,
                    'votes': 0,
                    'upvoters': [],
                    'menu': places_data[i].url,
                    'submittedOn' : new Date()
                });
            }
        }
    });

    Meteor.publish('orders', function(){
        return Orders.find({});
    });

    Meteor.publish('places', function(){
        return Places.find({});
    });

    Meteor.methods({
        addOrder : function(name, food){
            var orderId = Orders.insert({
                'name' : name,
                'food' : food,
                'submittedOn' : new Date()
            });
            return orderId;
        },
        clearAll : function() {
            console.log("clearing....")
            return Orders.remove({});
        },
        addPlace : function(username, name){
            var placeId = Places.insert({
                'username' : username,
                'name' : name,
                'votes': 0,
                'upvoters': [],
                'menu':'',
                'submittedOn' : new Date()
            });
            return placeId;
        },
        voteUp : function(placeId){
            var user = Meteor.user();
            if (!user){
                throw new Meteor.Error(401, "You need to login to upvote");
            }

            var place = Places.findOne(placeId);
            if (!place){
                throw new Meteor.Error(422, 'Place not found');
            }

            if (_.include(place.upvoters, user._id))
                throw new Meteor.Error(422, 'Already upvoted');

            Places.update(place._id, {
                $addToSet: {upvoters: user._id},
                $inc : {'votes':1}
            });
        }
    });


}
