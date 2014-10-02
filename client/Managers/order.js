if (Meteor.isClient) {

    Template.order.events({
        'click #deleteOrder' :function(event){
            event.preventDefault();
            Meteor.call("removeOrder", this['_id']);
        }
    });

    Template.order.helpers({
        timeFormat:function(){
            sumbittedDate = this.submittedOn;
            return moment(Date(sumbittedDate)).format('L');
        }
    });
}