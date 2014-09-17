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
            bootbox.dialog({
                message: "This will reset the site, clearing votes and orders!",
                title : "Are you sure?!?!",
                buttons:{
                    danger:{
                        label: "Yes!",
                        className:"btn-danger",
                        callback: function(){
                            Meteor.call("clearAll");
                        }
                    },
                    main:{
                        label: "No!",
                        className: "btn-primary",
                        callback: function(){
                        }
                    }
                }
            });


        },
        'click #hardClear' : function(event){
                        bootbox.dialog({
                message: "This will reset the site, clearing votes and orders!",
                title : "Are you sure?!?!",
                buttons:{
                    danger:{
                        label: "Yes!",
                        className:"btn-danger",
                        callback: function(){
                            Meteor.call('hardClear');
                        }
                    },
                    main:{
                        label: "No!",
                        className: "btn-primary",
                        callback: function(){
                        }
                    }
                }
            });

        }
    });
}