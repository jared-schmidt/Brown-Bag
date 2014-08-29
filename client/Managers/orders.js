if (Meteor.isClient) {

    Template.orders.events({
        'click #submitOrder': function (event) {
            console.log("order");
            event.preventDefault();

            Meteor.call("sendEmail", "jschmidt@problemsolutions.net", "test this", function(err){
                console.log("sent");
            });

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

    Template.clearAll.events({
        'click #saveClear': function(event){
            console.log("Clear");
            Meteor.call("clearAll");
        },
        'click #hardClear' : function(event){
            Meteor.call('hardClear');
        }
    });
}