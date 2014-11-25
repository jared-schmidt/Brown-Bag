Orders = new Meteor.Collection("orders");
Places = new Meteor.Collection("places");
Urls = new Meteor.Collection("urls");
DesktopNotifications = new Meteor.Collection("desktopNotifications");

if (Meteor.isServer) {
    Meteor.startup(function (){
        console.log(Meteor.settings['found_file']);
        var yelp = Meteor.npmRequire('yelp').createClient({
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

            collectionApi = new CollectionAPI({
                authToken: '97f0ad9e24ca5e0408a269748d7fe0a0',
                apiPath: 'api'
            });
            collectionApi.addCollection(Places,'places',{
                methods:['GET']
            });
            collectionApi.start();
            console.log("Started API");

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

    //util that will return any url parameters.
    //in key value pairs (ex. ..?a=b&c=d will be in format of {a: b, c: d})
    var getUrlParams = function(url) {
        var params = url.split('?');
        if (params.length == 2) {
            params = params[1].split('&');
            var p = {};
            for (var i = 0; i < params.length; i++) {
                var param = params[i].split('=');
                if(param.length == 2) {
                    p[param[0]] = param[1];
                }
            }
            return p;
        } else {
            return {};
        }
    }

    //TODO add additional parsers here; vimeo, etc.
    var videoUrlParsers = [
        {
            name: 'YouTube',
            canParseUrl: function(url) {
                return url.indexOf('youtube.com') >= 0;
            },
            getEmbedUrl: function(url) {
                var videoId = getUrlParams(url)['v'];
                if (videoId) {
                    return '//youtube.com/embed/' + videoId;
                } else {
                    //want to ensure we don't specify protocol
                    var parts = url.split('youtube.com');
                    return '//youtube.com/' + parts[parts.length - 1];
                }
            }
        }
    ];


    Meteor.methods({
        removeOrder : function(orderId){
            Orders.remove(orderId);
        },
        addOrder : function(name, food){
            var orderId = Orders.insert({
                'name' : name,
                'food' : food,
                'submittedOn' : new Date()
            });
            return orderId;
        },
        clearAll : function() {
            // Run in mongo to clear everyones orders
            //  // db.users.update({},{$set:{'ordered': []}})

            console.log("clearing all orders....");

            // Picks the one with the highest votes, and adds to a set,
                // in the object
            place = Places.findOne({},{sort:{'votes': -1}});
            date_picked = new Date();
            // Set the time to this, so duplicates won't be added
            date_picked.setHours(0,0,0,0)
            Places.update(place._id,{$addToSet : {'datePicked': date_picked} });

            // Better way to do this?
            // Places.find().forEach(function(place){
            //     Places.update(place._id, {
            //         $set : {"upvoters" : []}
            //     });
            // });

            // Better way to do this?

            Orders.find().forEach(function(order){
                Meteor.users.find().forEach(function(user){
                    //console.log(user);
                    if(order.name == user.profile.name){
                        Meteor.users.update(user._id,{
                            $addToSet:{'ordered' : {'place._id' : place._id, 'place': place.name, 'order' : order.food, 'datePicked' : date_picked}}
                        });
                    }
                });
            });

            //Clear all votes and orders

            Places.find().forEach(function(place){
                Places.update(place._id,{
                    $set : {"upvoters" : [],'votes':0, 'winner': 0}
                });
            });

            Orders.remove({});

            return true;
        },
        hardClear : function(){
            // TODO: same as above, make function
            Places.find().forEach(function(place){
                Places.update(place._id, {
                    $set : {"upvoters" : [],'votes':0, 'winner': 0}
                });
            });

            // TODO: same as above, make function
            // Places.find().forEach(function(place){
            //     Places.update(place._id,{
            //         $set:{}
            //     });
            // });

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
            var displayUrl = url;
            var embedUrl = url;
            var embeddable = false;
            for (var i = 0; i < videoUrlParsers.length; i++) {
                var parser = videoUrlParsers[i];
                if (parser.canParseUrl(url)) {
                    embedUrl = parser.getEmbedUrl(url);
                    embeddable = true;
                    break;
                }
            }

            if (!embeddable) {
                if (url.indexOf('//') < 0) {
                    url = '//' + url;
                }
            }

            var urlId = Urls.insert({
                'username' : username,
                'displayUrl' : displayUrl,
                'url' : url,
                'embedUrl' : embedUrl,
                'embeddable' : embeddable,
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
        publishNotification: function(notification){
            DesktopNotifications.remove({});
            DesktopNotifications.insert(notification);
            setTimeout(Meteor.bindEnvironment(function() {
                DesktopNotifications.remove({}); //remove all again so we don't get pop ups when first loading
            }));
        },
        sendEmail:function(to, message, subject){
            if (!subject) subject="Brown Bag";
            Email.send({
                from: "brown.bag.ps@gmail.com",
                to: to,
                subject: subject,
                text: message
            });
        },
        removeVote:function(id){
            var user = Meteor.user();

            Places.update(id, {$inc: {votes: -1}, $pull: {'upvoters': user._id}});
        },
        getUserInfo:function(){
            return Meteor.user();
        },
        endPlaceVoting:function(){
            place = Places.findOne({},{sort:{'votes': -1}});
            Places.update(place._id,{$set: {"winner": 1}});
            return place._id;
        },
        did:function(id){
            Urls.update(id, {$set:{"did":true}});
        },
        removePlace:function(placeid){
            Places.remove(placeid);
        },
        confirmSlack:function(userid){
            console.log("In server");
            Meteor.users.update({'_id':userid}, {$set:{'api.confirmed': true}});
        }
    });
}
