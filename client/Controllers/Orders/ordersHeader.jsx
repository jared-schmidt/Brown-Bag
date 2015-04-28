OrdersHeader = ReactMeteor.createClass({
    getMeteorState: function(){
        return {
            totalUsers: Session.get('totalUsers'),
            totalOrders: Session.get('totalOrders')
        }
    },
    componentWillMount: function(){
        Meteor.call('getTotalActiveUsers', function(err, result){
            if (err){
                console.error(err);
            }
            Session.set('totalUsers', result);
        });

        Meteor.call('getTotalOrders', function(err, result){
            if (err){
                console.error(err);
            }
            Session.set('totalOrders', result);
        });
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
                Session.set('totalOrders', Session.get('totalOrders') + 1);
                document.getElementById("food").value = '';
                if (order.alreadyOrdered){
                    toastr.warning("You placed more then 1 order!", "Warning!");
                }
            }
        });
    },
    getInitialState: function () {
        return {
            totalOrders: 0,
            totalUsers: 0
        };
    },
    render: function(){
        return <div className='group-header'>
            <div className="title-bar row">
                <span className="title col-sm-8">All Orders</span>
                <span className="count col-sm-4">{this.state.totalOrders} of {this.state.totalUsers} Order(s) Placed</span>
            </div>
            <div className="entry form-horizontal">
                <div className="form-group">
                    <div className="col-sm-8">
                        <input type='text' placeholder="what you want..." id="food" className="form-control"/>
                    </div>
                    <div className="col-sm-4">
                        <input onClick={this.addNewOrder} type="button" className='btn btn-success' value="Submit" />
                    </div>
                </div>
            </div>
        </div>
    }
});
