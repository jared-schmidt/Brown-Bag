MessagesHeader = ReactMeteor.createClass({
    getMeteorState: function(){
        return {
            messageCount: Messages.find({}).count()
        }
    },
    componentDidMount: function () {
        $.material.input();
    },
    addNewMessage: function(){
        var user = Meteor.user();

        if (!user){
            return;
        }

        var message = document.getElementById("message").value;

        if (message){

            Meteor.call("addMessage", message, function(err, messageId){
                if (err){
                    console.error(err);
                    toastr.error(err.reason, "Error!");
                } else {
                    document.getElementById("message").value = '';
                }
            });
        } else {
            toastr.error("No message text entered", "Error!");
        }
    },
    getInitialState: function () {
        return {
            messageCount: 0,
            isAdmin: Meteor.user().roles === Meteor.settings.adminTitle
        };
    },
    renderInput: function(){
        return <div className="entry form-horizontal">
            <div className="form-group">
                <div className="col-sm-8">
                    <input data-hint="" type='text' placeholder="What would you like to tell everyone..." id="message" className="form-control floating-label"/>
                </div>
                <div className="col-sm-4">
                    <input onClick={this.addNewMessage} type="button" className='btn btn-success' value="Submit" />
                </div>
            </div>
        </div>
    },
    render: function(){
        return <div className='group-header'>
            <div className="title-bar row">
                <span className="count col-sm-4">{this.state.messageCount} Message(s) created</span>
            </div>
            {this.state.isAdmin ? this.renderInput() : null}
        </div>
    }
});
