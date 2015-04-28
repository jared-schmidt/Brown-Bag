OrderRow = React.createClass({
    deleteOrder: function(id, userName){
        if (Meteor.user().profile.name === userName){
            Meteor.call("removeOrder", id, function(err){
                if (err){
                    console.error(err);
                    toastr.error(err.reason, "Error!");
                } else {
                    Session.set('totalOrders', Session.get('totalOrders') - 1);
                }
            });
        }
    },
    getInitialState: function () {
        var userName = this.props.personName;
        return {
            showDeleteBtn: Meteor.user().profile.name === userName
        };
    },
    renderDeleteBtn: function(orderid, personName){
        return <button onClick={this.deleteOrder.bind(this, orderid, personName)} className='btn btn-link no-space floatRight'>
            <span className="fa fa-trash-o"></span>
        </button>
    },
    render: function(){
        var {orderid, personName, foodOrder} = this.props;
        return <div className="panel panel-default">
                <div className="panel-body container-fluid">
                    <div className='row'>
                        <div className="col-xs-4 col-md-4">{personName}</div>
                        <div className="col-xs-4 col-md-4">{foodOrder}</div>
                        <div className="col-xs-4 col-md-4">{this.state.showDeleteBtn ? this.renderDeleteBtn(orderid, personName) : null}</div>
                    </div>
                </div>
        </div>
    }
});
