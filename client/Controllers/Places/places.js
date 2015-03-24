if (Meteor.isClient) {
    Template.places.events({
        'click #submitPlace':function(event){
            event.preventDefault();

            var user = Meteor.user();
            console.log(user);
            if (!user){
                return;
            }

            var place = document.getElementById("place").value;
            var menu = document.getElementById("menu").value;

            Meteor.call("addPlace", user.profile.name, place, menu, function(error, placeId){
                toastr.success("Sounds like the bee's knees", "Place Added!");
            });

            document.getElementById("place").value = '';
            document.getElementById("menu").value = '';
        },
        'click #random_place': function(event){

            Meteor.call('randomPlace', function(error, place_id){

                    document.getElementById('random_place').removeAttribute('style');

                    var deg = 500 + Math.round(Math.random() * 500);

                    var css = '-webkit-transform: rotate(' + deg + 'deg);';

                    document.getElementById('random_place').setAttribute(
                        'style', css
                    );
                    toastr.success("The wheel goes round!", "Random!");

                Meteor.call("voteUp", place_id, function(err, data){
                    $('#upvote').prop("disabled", false);
                    toastr.success("You better like your pick or the lockness monster won't be happy!", "Voted!");
                });
            });
        }
    });

    Meteor.call('getTotalVotes', function(err, result){
        Session.set('totalVotes', result);
    });

    Meteor.call('getTotalActiveUsers', function(err, result){
        Session.set('totalUsers', result);
    });

    Template.places.helpers({
        'currentVoted': function(){
            return Session.get('totalVotes');
        },
        'totalUsers': function(){
            return Session.get('totalUsers');
        }
    });

    // Prints the places with votes in the console
    var code = Meteor.settings.public['vote_code'];
    Mousetrap.bind(code, function() {
      Meteor.call('get_current_votes', function(error, vote_message){
        bootbox.alert(vote_message, function(){
            toastr.success("You win all!", "WINNER");
        });
      });
    });
}
