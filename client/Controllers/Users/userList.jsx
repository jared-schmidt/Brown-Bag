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
    componentDidMount: function () {
        $.material.checkbox();
    },
    renderUser: function(model, index){
        if (this.state.filter)
          if (!model.ordered){
            return <UserRow
                key={model._id}
                userid={model._id}
                avatar={model.profile.picture}
                personName={model.profile.name}
                role={model.roles}
                active={model.profile.active}
                voted={model.voted}
                ordered={model.ordered} />
          } else {
            return null;
          }
        else {
          return <UserRow
              key={model._id}
              userid={model._id}
              avatar={model.profile.picture}
              personName={model.profile.name}
              role={model.roles}
              active={model.profile.active}
              voted={model.voted}
              ordered={model.ordered} />
        }
    },
    renderHeader: function(model){
        return <UserHeader />
    },
    filterList: function(){
      var current_state = this.state.filter;

      this.setState({
        filter: !current_state
      });
    },
    renderCheckbox: function(label){
        return <div className="checkbox no-space floatRight">
        <label>
          <b>{label}:</b>
          <br/>
          <input
                type="checkbox"
                onChange={this.filterList}
          />
        </label>
      </div>
    },
    render: function(){
        return <div>
            {this.renderCheckbox('Show user(s) who did not order')}

            {this.renderHeader(this.state)}

            <ReactCSSTransitionGroup transitionName="example">
                {this.state.users.map(this.renderUser)}
            </ReactCSSTransitionGroup>
        </div>;
    }
});
