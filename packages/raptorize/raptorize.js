// Write your package code here!
if (Meteor.isClient) {
    // Raptorize = function(){
    //     console.log("here it comes");
    //     $('#raptorizeButton').raptorize();
    // };

    Template.raptorize.rendered = function() {
        if (!this._rendered) {
            this._rendered = true;
            $("#raptorizeButton").raptorize();
        }
    }
}
