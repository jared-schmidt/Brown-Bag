if (Meteor.isClient) {
    Template.places.events({
        'click #submitPlace':function(event){
            console.log('places button');
            event.preventDefault();

            var user = Meteor.user();
            console.log(user);
            if (!user){
                return;
            }

            var place = document.getElementById("place").value;
            var menu = document.getElementById("menu").value;

            Meteor.call("addPlace", user.profile.name, place, menu, function(error, placeId){
                console.log('added place with Id .. '+placeId)
            });

            document.getElementById("place").value = '';
            document.getElementById("menu").value = '';
        }
    });

    Template.places.helpers({
        'currentVoted': function(){
            var totalVotes = 0;
            Places.find({}).map(function(doc){
                totalVotes += doc.votes;
            });
            return totalVotes;
        }
    });

    // Prints the places with votes in the console
    var code = Meteor.settings.public['vote_code'];
    Mousetrap.bind(code, function() {
      places = Places.find({},{sort:{'votes': -1}}).fetch();
      var vote_message = '<table style="border: 1px black solid">';
      // Prints this to the web console
      console.log("----------------VOTES----------------")
      for(var p in places){
        var name = places[p].name;
        var votes = places[p].votes;
        if (votes > 0){
            console.log(name + ' - ' + votes);
            vote_message += '<tr><td style="padding:5px;border: 1px black solid">'+name+'</td><td style="padding:5px;border: 1px black solid">'+votes+'</td></tr>';
        }
      }
      vote_message += '</table>'
      console.log("----------------END VOTES----------------")

      bootbox.alert(vote_message, function(){
        console.log("call back....");
      });
    });

}
