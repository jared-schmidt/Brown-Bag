OrdersHeader = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function(){
        return {
            totalUsers: Session.get('totalUsers'),
            totalOrders: Orders.find({}).count(),
            winningPlace: true
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

        // CALL THE RAPTOR!
        Raptorize();

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
            <h3>Winner is <i>{this.data.winningPlace ? this.data.winningPlace.name : null}</i></h3>
            <a target='_blank' href={this.data.winningPlace ? this.data.winningPlace.menu : null}>Menu</a>
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
                <span className="count col-sm-4">{this.data.totalOrders} of {this.data.totalUsers} Order(s) Placed</span>
            </div>
            {this.data.winningPlace ? this.renderOrderInput() : "Voting is still going on!"}
            {this.data.winningPlace ? this.renderWinner() : null}
        </div>
    }
});
