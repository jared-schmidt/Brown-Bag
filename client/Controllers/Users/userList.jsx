var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

UserList = ReactMeteor.createClass({
    startMeteorSubscriptions: function() {
       Meteor.subscribe('userData');
     },
    getMeteorState: function(){
        return {
            users: Meteor.users.find({}, {sort:{'roles': 1, 'profile.active': -1, 'profile.family_name': 1}}).fetch()
        }
    },
    renderUser: function(model, index){
        return <UserRow
            key={index}
            userid={model._id}
            avatar={model.profile.picture}
            personName={model.profile.name}
            role={model.roles}
            active={model.profile.active}
            voted={model.voted}
            ordered={model.ordered}
        />
    },
    getInitialState: function(){
        return {users: []};
    },
    renderHeader: function(model){
        return <UserHeader />
    },
    render: function(){
        return <div>
            {this.renderHeader(this.state)}
            <ReactCSSTransitionGroup transitionName="example">
                {this.state.users.map(this.renderUser)}
            </ReactCSSTransitionGroup>
        </div>;
    }
});
