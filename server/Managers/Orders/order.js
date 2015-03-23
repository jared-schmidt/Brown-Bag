if (Meteor.isServer) {
    Meteor.methods({
        removeOrder : function(orderId){
            Orders.remove(orderId);
        },
        addOrder : function(name, food){
            var orderId = Orders.insert({
                'name' : name,
                'food' : food,
                'submittedOn' : new Date()
            });
            return orderId;
        }
    });
}