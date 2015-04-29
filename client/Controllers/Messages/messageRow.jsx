MessageRow = React.createClass({
    getInitialState: function () {
        return {
            isAdmin: Meteor.user().roles === Meteor.settings.adminTitle
        };
    },
    deleteMessage: function(id){
        Meteor.call("deleteMessage", id, function(err, messageId){
            if (err){
                console.error(err);
                toastr.error(err.reason, "Error!");
            }
        });
    },
    renderDeleteBtn: function(messageid){
        return <button onClick={this.deleteMessage.bind(this, messageid)} className='btn btn-link no-space floatRight'>
            <span className="fa fa-trash-o"></span>
        </button>
    },
    render: function(){
        var {messageid, message} = this.props;
        return <div className="panel panel-default">
                <div className="panel-body container-fluid">
                    <div className='row'>
                        <div className="col-xs-4 col-md-4">{message}</div>
                        <div className="col-xs-4 col-md-4">{this.state.isAdmin ? this.renderDeleteBtn(messageid) : null}</div>
                    </div>
                </div>
        </div>
    }
});
