var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

UserList = React.createClass({
    mixins: [ReactMeteorData],
    getInitialState: function(){
      return {
        filter: false
      }
    },
    getMeteorData: function(){
        Meteor.subscribe('userData');
        Meteor.subscribe('groups');
        var users = Meteor.users.find({}, {sort: {'group': 1,'profile.family_name': 1}}).fetch();
        // var userRoles = _.groupBy(users, 'roles')
        // users: Meteor.users.find({}, {sort:{'roles': 1, 'profile.active': -1, 'profile.family_name': 1}}).fetch()

        var activeUsers = _.groupBy(users, function(user){
          return user.profile.active;
        });

        return {
          activeUsers: activeUsers.true,
          unActiveUser: activeUsers.false,
          filter: false
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
                group={model.group}
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
              group={model.group}
              ordered={model.ordered} />
        }
    },
    renderHeader: function(model){
        return <UserHeader />
    },
    filterList: function(){
      console.log("Filter list");
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
    renderList: function(arr, title){
      return <div className="panel panel-default">
        <div className='panel-heading clearfix'>
            <h5>{title}</h5>
        </div>

        <div className="panel-body container-fluid">
            {
              arr
            ?
              <ReactCSSTransitionGroup transitionName="example">
                {arr.map(this.renderUser)}
              </ReactCSSTransitionGroup>
            :
              "List is empty"
            }
        </div>

      </div>
    },
    render: function(){
        return <div>
            {this.renderCheckbox('Show user(s) who did not order')}

            {this.renderHeader(this.state)}

            {this.renderList(this.data.activeUsers, "Active")}
            <br />
            <br />
            {this.renderList(this.data.unActiveUser, "Not Active")}

        </div>;
    }
});
