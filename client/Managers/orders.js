if (Meteor.isClient) {

    Template.orders.events({
        'click input.btn': function (event) {
            event.preventDefault();

            var user = Meteor.user();

            if (!user){
                return;
            }

            var food = document.getElementById("food").value;

            Meteor.call("addOrder", user.profile.name, food, function(error, orderId){
                //console.log('added order with Id .. '+orderId)
            });

            document.getElementById("food").value = '';
        }
    });

    Template.orders.items = function(){
        return Orders.find({},{sort:{'submittedOn': -1}})
    };

    Template.clearAll.events({
        'click input': function(event){
            console.log("Clear");
            Meteor.call("clearAll");
        }
    });
}