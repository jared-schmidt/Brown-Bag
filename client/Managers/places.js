if (Meteor.isClient) {

    Template.places.events({
        'click input.btn':function(event){
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
        }
    });

    Template.places.items = function(){
        return Places.find({}, {sort:{'votes': -1}})
    }
}
