Orders = new Meteor.Collection("orders");
Places = new Meteor.Collection("places");
Urls = new Meteor.Collection("urls");
DesktopNotifications = new Meteor.Collection("desktopNotifications");   

if (Meteor.isServer) {
    Meteor.startup(function (){
        var yelp = Meteor.require('yelp').createClient({
            consumer_key: 'WDYAKycarqBqWcfxtrwccQ',
            consumer_secret: '3CtLvBMCISjIlXUQ0MlNyAzvmxg',
            token: 'Yw_FZ2UJ-yXa_ck5A1zWuRkTW7yn9OaW',
            token_secret: '2Bxoraz5ZAjVjZ8yMzUkATunDRY'
        });
        // code to run on server at startup
        if (Places.find().count() === 0){
            console.log('No places, querying yelp');
            yelp.search({
                term: 'food',
                location: '15904',
                sort: 2
            }, Meteor.bindEnvironment(function(error, data) {
                if (data.businesses) {
                    var places_data = data.businesses;
                    console.log('Found ' + places_data.length + ' places.');
                    for (var i = 0; i < places_data.length; i++) {
                        var place = places_data[i];
                        Places.insert({
                            username: 'yelp',
                            name: place.name,
                            votes: 0,
                            upvoters: [],
                            menu: place.url,
                            submittedOn: new Date(),
                            datePicked : []
                        });
                    }
                }
            }));
        }
    });

    Meteor.publish("desktopNotifications", function(){
        return DesktopNotifications.find({});
    });

    Meteor.publish('orders', function(){
        return Orders.find({});
    });

    Meteor.publish('places', function(){
        return Places.find({});
    });

    Meteor.publish('urls', function(){
        return Urls.find({});
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
            console.log("clearing all orders....");

            // Picks the one with the highest votes, and adds to a set,
                // in the object
            place = Places.findOne({},{sort:{'votes': -1}});
            date_picked = new Date();
            // Set the time to this, so duplicates won't be added
            date_picked.setHours(0,0,0,0)
            Places.update(place._id,{$addToSet : {'datePicked': date_picked} });

            // Better way to do this?
            Places.find().forEach(function(place){
                Places.update(place._id, {
                    $set : {"upvoters" : []}
                });
            });

            // Better way to do this?

            Orders.find().forEach(function(order){
                Meteor.users.find().forEach(function(user){
                    //console.log(user);
                    if(order.name = user.profile.name){
                        Meteor.users.update(user._id,{
                            $addToSet:{'ordered' : {'place._id' : place._id, 'palce': place.name, 'order' : order.food, 'datePicked' : date_picked}}
                        });
                    }
                });
            });

            //Clear all votes and orders

            Places.find().forEach(function(place){
                Places.update(place._id,{
                    $set:{'votes':0}
                });
            });

            Orders.remove({});

            return true;
        },
        hardClear : function(){
            // TODO: same as above, make function
            Places.find().forEach(function(place){
                Places.update(place._id, {
                    $set : {"upvoters" : []}
                });
            });

            // TODO: same as above, make function
            Places.find().forEach(function(place){
                Places.update(place._id,{
                    $set:{'votes':0}
                });
            });

            Orders.remove({});
            return true;
        },
        addPlace : function(username, name, menu){
            var placeId = Places.insert({
                'username' : username,
                'name' : name,
                'votes': 0,
                'upvoters': [],
                'menu': menu,
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
                $addToSet: {'upvoters': user._id},
                $inc : {'votes':1}
            });
        },
        resetVotes : function(placeId){
            Places.update(placeId, {
                $set : {"upvoters" : [],'votes':0},
            });
        },
        addUrl : function(username, url){
            var urlId = Urls.insert({
                'username' : username,
                'url' : url,
                'votes' : 0,
                'upvoters' : [],
                'submittedOn' : new Date()
            });
            return urlId;
        },
        resetUrlVotes:function(urlId){
            Urls.update(urlId, {
                $set : {"upvoters" : [],'votes':0},
            })
        },
        upUrlVote : function(urlId){
            var user = Meteor.user();
            if (!user){
                throw new Meteor.Error(401, "You need to login to upvote");
            }

            var url = Urls.findOne(urlId);
            if (!url){
                throw new Meteor.Error(422, 'Url not found');
            }

            if (_.include(url.upvoters, user._id))
                throw new Meteor.Error(422, 'Already upvoted');

            Urls.update(url._id, {
                $addToSet: {'upvoters': user._id},
                $inc : {'votes':1}
            });
        },
        publishNotification: function(){
            DesktopNotifications.remove({});
            DesktopNotifications.insert({
                title: 'Orders Being Placed',
                body: 'The food is being ordered soon, please make sure your order is in.',
                icon: 'brown-bag.png'
            });
            setTimeout(Meteor.bindEnvironment(function() {
                DesktopNotifications.remove({}); //remove all again so we don't get pop ups when first loading
            }));
        }
    });
}
