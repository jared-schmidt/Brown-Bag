if (Meteor.isClient) {

    Template.orders.events({
        'click #submitOrder': function (event) {
            event.preventDefault();

            var user = Meteor.user();

            if (!user){
                return;
            }

            var food = document.getElementById("food").value;

            Meteor.call("addOrder", user.profile.name, food, function(error, orderId){
                // toastr.success("Sounds okay-ish... I guess...", "Order Placed");
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
                            Meteor.call("clearAll", function(){
                                // toastr.success("...and boom goes the dynamite.", "Reset & Saved!");
                            });
                        }
                    },
                    main:{
                        label: "No!",
                        className: "btn-primary",
                        callback: function(){
                            // toastr.success("That was a close one", "Reset!");
                        }
                    }
                }
            });


        }
    });
}