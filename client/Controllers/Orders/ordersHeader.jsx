OrdersHeader = ReactMeteor.createClass({
    getMeteorState: function(){
        return {
            totalUsers: Session.get('totalUsers'),
            totalOrders: Orders.find({}).count(),
            winningPlace: Places.findOne({'winner': 1})
        }
    },
    componentWillMount: function(){
        Meteor.call('getTotalActiveUsers', function(err, result){
            if (err){
                console.error(err);
            }
            Session.set('totalUsers', result);
        });
    },
    componentDidMount: function () {
        $.material.input();
    },
    addNewOrder: function(){
        var user = Meteor.user();

        if (!user){
            return;
        }

        var food = document.getElementById("food").value;

        Meteor.call("addOrder", user.profile.name, food, function(err, order){
            if (err){
                console.error(err);
                toastr.error(err.reason, "Error!");
            } else {
                document.getElementById("food").value = '';
                if (order.alreadyOrdered){
                    toastr.warning("You placed more then 1 order!", "Warning!");
                }
            }
        });
    },
    renderWinner: function(){
        return <div>
            <h3>Winner is <i>{this.state.winningPlace ? this.state.winningPlace.name : null}</i></h3>
            <a href='{this.state.winningPlace ? this.state.winningPlace.menu : null}'>Menu</a>
        </div>
    },
    renderOrderInput: function(){
        return <div className="entry form-horizontal">
            <div className="form-group">
                <div className="col-sm-8">
                    <input data-hint="" type='text' placeholder="what you want..." id="food" className="form-control floating-label"/>
                </div>
                <div className="col-sm-4">
                    <input onClick={this.addNewOrder} type="button" className='btn btn-success' value="Submit" />
                </div>
            </div>
        </div>
    },
    render: function(){
        return <div className='group-header'>
            <div className="title-bar row">
                <span className="title col-sm-8">All Orders</span>
                <span className="count col-sm-4">{this.state.totalOrders} of {this.state.totalUsers} Order(s) Placed</span>
            </div>
            {this.state.winningPlace ? this.renderOrderInput() : "Voting is still going on!"}
            {this.state.winningPlace ? this.renderWinner() : null}
        </div>
    }
});
