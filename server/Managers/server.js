Orders = new Meteor.Collection("orders");
Places = new Meteor.Collection("places");
Urls = new Meteor.Collection("urls");
DesktopNotifications = new Meteor.Collection("desktopNotifications");


if (Meteor.isServer) {

    Meteor.methods({
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

            Orders.remove({});
            return true;
        },
        publishNotification: function(notification){
            DesktopNotifications.remove({});
            DesktopNotifications.insert(notification);
            setTimeout(Meteor.bindEnvironment(function() {
                DesktopNotifications.remove({}); //remove all again so we don't get pop ups when first loading
            }));

            var url = 'https://slack.com/api/chat.postMessage';
            var slack_api_token = Meteor.settings['slack_api_token'];
            var message = "Ordering soon-ish...";
            var payload = {
                "token":slack_api_token,
                "channel":'G037P84PQ',
                "text": message,
                "icon_emoji": ':ghost:',
                "username": "Draco (Ghost)",
                'parse':"full"
            }
            var result = HTTP.call("GET", url, {params: payload});

        },
        vote_Notification:function(){
            var url = 'https://slack.com/api/chat.postMessage';
            var slack_api_token = Meteor.settings['slack_api_token'];
            var message = "Did YOU vote?! http://brown-bag.meteor.com/places";
            var payload = {
                "token":slack_api_token,
                "channel":'G037P84PQ',
                "text": message,
                "icon_emoji": ':ghost:',
                "username": "Draco (Ghost)",
                'parse':"full"
            }
            var result = HTTP.call("GET", url, {params: payload});
        },
        getUserInfo:function(){
            return Meteor.user();
        },
        confirmSlack:function(userid){
            console.log("In server");
            Meteor.users.update({'_id':userid}, {$set:{'api.confirmed': true}});
        },
        slack_message:function(message){
            var url = 'https://slack.com/api/chat.postMessage';
            var slack_api_token = Meteor.settings['slack_api_token'];
            var payload = {
                "token":slack_api_token,
                "channel":'G030ZA6P5',
                "text": message,
                "icon_emoji": ':ghost:',
                "username": "Draco (Ghost)",
                'parse':"full"
            };
            var result = HTTP.call("GET", url, {params: payload});
        }
    });
}
