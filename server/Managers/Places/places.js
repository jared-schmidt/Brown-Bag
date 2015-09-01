if (Meteor.isServer) {
    Meteor.methods({
        // randomPlace: function(){
        //     var user = Meteor.user();

        //     var places = Places.find().fetch();
        //     var random_num = Math.floor(Math.random() * places.length-1) + 0;

        //     return places[random_num]._id;
        // },
        addPlace : function(username, name, menu){
            if (Meteor.user() &&  Meteor.user().roles === 'admin'){
                if (name && menu){
                    var placeId = Places.insert({
                        'username' : username,
                        'name' : name,
                        'votes': 0,
                        'upvoters': [],
                        'menu': menu,
                        'submittedOn' : new Date()
                    });
                    return placeId;
                }
                throw new Meteor.Error(422, 'Name and menu missing.');
            }
            else if(!Meteor.user()){
                if (name && menu){
                    Places.insert({
                        'username' : username,
                        'name' : name,
                        'votes': 0,
                        'upvoters': [],
                        'menu': menu,
                        'submittedOn' : new Date()
                    });
                }
            } else {
                throw new Meteor.Error(422, 'Must be an admin.');
            }
        },
        getTotalVotes: function(){
            var totalVotes = 0;
            Places.find({}).map(function(doc){
                totalVotes += doc.votes;
            });
            return totalVotes;
        },
        resetVotes : function(placeId){
            Places.update(placeId, {
                $set : {"upvoters" : [],'votes':0},
            });
        },
        endPlaceVoting:function(){
            place = Places.findOne({},{sort:{'votes': -1}});
            Places.update(place._id,{$set: {"winner": 1}});

            console.log("End Voting...");
            var message = "Voting has ended! The winner is " + place.name + ". Place your orders now! Here could be the menu " + place['menu'];

            slackMessage(message);

            return place._id;
        },
        getTotalActiveUsers: function(){
            var users = Meteor.users.find({'profile.active': true}).fetch();
            return users.length;
        },
        get_current_votes:function(){
            var user = Meteor.user();

            var vote_message = '';

            if (user.roles == 'admin'){
                places = Places.find({},{sort:{'votes': -1}}).fetch();
                vote_message = '<table style="border: 1px black solid">';
                // Prints this to the web console
                for(var p in places){
                  var name = places[p].name;
                  var votes = places[p].votes;
                  if (votes > 0){
                      vote_message += '<tr><td style="padding:5px;border: 1px black solid">'+name+'</td><td style="padding:5px;border: 1px black solid">'+votes+'</td></tr>';
                  }
                }
                vote_message += '</table>';
            } else {
                vote_message = "YouShallNotPass.gif";

                var message = user.profile.name + " tried to cheat on the Brown-Bag site! \n YouShallNotPass.gif";
                slackMessage(message);
            }
            return vote_message;
        },
    });
}
