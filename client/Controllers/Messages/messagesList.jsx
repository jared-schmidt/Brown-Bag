var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

MessagesList = ReactMeteor.createClass({
    startMeteorSubscriptions: function(){
        Meteor.subscribe('messages');
    },
    getMeteorState: function(){
        return {
            messages: Messages.find({}).fetch()
        }
    },
    renderMessage: function(model, index){
        return <MessageRow
            key={model._id}
            messageid={model._id}
            message={model.message} />
    },
    renderHeader: function(model){
        return <MessagesHeader />
    },
    render: function(){
        return <div>
            {this.renderHeader(this)}
            <ReactCSSTransitionGroup transitionName="example">
                {this.state.messages.map(this.renderMessage)}
            </ReactCSSTransitionGroup>

        </div>
    }
});
