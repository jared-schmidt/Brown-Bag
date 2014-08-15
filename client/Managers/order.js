if (Meteor.isClient) {

    Template.order.events({
        'click #deleteOrder' :function(event){
            event.preventDefault();
            console.log("deleteing..." +this['_id'])
            Orders.remove(this['_id']);
        }
    });
}