if (Meteor.isServer) {
    Meteor.methods({
        removeOrder : function(orderId){
            var user = Meteor.user();
            Meteor.users.update(user._id,{
                $set:{'ordered':false}
            });
            Orders.remove(orderId);
        },
        addOrder : function(name, food){
            var orderId = Orders.insert({
                'name' : name,
                'food' : food,
                'submittedOn' : new Date()
            });

            var user = Meteor.user();
            Meteor.users.update(user._id, {
                $set:{'ordered': true}
            });

            return orderId;
        }
    });
}