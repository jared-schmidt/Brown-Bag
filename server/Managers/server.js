Orders = new Meteor.Collection("orders");
Places = new Meteor.Collection("places");
Urls = new Meteor.Collection("urls");
DesktopNotifications = new Meteor.Collection("desktopNotifications");
Messages = new Meteor.Collection('messages');

if (Meteor.isServer) {

    Meteor.methods({
        addMessage: function(message){
            var user = Meteor.user();
            var messageId = Messages.insert({
                'message': message,
                'usersClosed': [],
                'display': true,
                'addedBy': user._id,
                'createdOn': new Date()
            });
            return messageId;
        },
        deleteMessage: function(messageId){
            Messages.remove(messageId);
        },
        userClosed: function(messageId){
            var user = Meteor.user();

            Messages.update(messageId, {
                $addToSet: {'usersClosed': user._id}
            });
        },
        changeLayout: function(userid, layout){
            Meteor.users.update({'_id':userid}, {$set:{'profile.layout': layout}});
        },
        changeColor: function(userid, color){
            Meteor.users.update({'_id':userid}, {$set:{'profile.color': color}});
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

            Meteor.users.forEach(function(user){
                Meteor.users.update(user._id, {
                    $set:{'voted': true}
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

            Meteor.users.forEach(function(user){
                Meteor.users.update(user._id, {
                    $set:{'voted': true}
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
                "channel":'G045PRA4A',
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
                "channel":'G045PRA4A',
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
