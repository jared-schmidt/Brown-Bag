if (Meteor.isClient) {

    Template.messages.events({
        'click #submitMessage': function (event) {
            event.preventDefault();

            var message = document.getElementById("message").value;

            Meteor.call("addMessage", message, function(error, messageId){
                toastr.success("Roger that!", "Message Added!");
            });

            document.getElementById("message").value = '';
        }
    });
}