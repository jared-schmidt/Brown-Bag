var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

OrdersList = ReactMeteor.createClass({
    startMeteorSubscriptions: function(){
        Meteor.subscribe('orders');
        Meteor.subscribe('winnerPlace');
    },
    getMeteorState: function(){
        return {
            orders: Orders.find({}, {sort: {name: 1}}).fetch()
        }
    },
    renderOrder: function(model, index){
        return <OrderRow
            key={model._id}
            orderid={model._id}
            personName={model.name}
            foodOrder={model.food} />
    },
    renderHeader: function(model){
        return <OrdersHeader />
    },
    render: function(){
        return <div>
            {this.renderHeader(this.state)}

            <ReactCSSTransitionGroup transitionName="example">
                {this.state.orders.map(this.renderOrder)}
            </ReactCSSTransitionGroup>

        </div>
    }
});
