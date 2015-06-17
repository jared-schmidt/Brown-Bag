UserRow = ReactMeteor.createClass({
    toggleActiveUser: function(id){
        Meteor.call('activeUser', id, function(err, isActive){
            if (err){
                console.error(err);
                toastr.error(err.reason, "Error!");
            } else {
                var currUser = Session.get('totalUsers');

                if (isActive){
                    Session.set('totalUsers', currUser + 1);
                } else {
                    Session.set('totalUsers', currUser - 1);
                }
            }
        });
    },
    componentDidMount: function () {
        $.material.checkbox();
    },
    renderCheckbox: function(label, checked, id){
        return <div className="checkbox no-space floatRight">
            <label>
                <b>{label}:&nbsp;</b>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={this.toggleActiveUser.bind(this, id)}
                    />
            </label>
        </div>
    },
    renderIsActive: function(label, checked){
        return <div className="floatRight">
            <b>{label}:</b>
            <br/>
            {checked ? "Yes" : "No"}
        </div>
    },
    getMeteorState: function(){
        return {
            groups: Groups.find({}).fetch()
        }
    },
    renderOption: function(model, index){
        var currentGroup = this.props.group;
        return <option value={model._id} key={index}>
            {model.name}
        </option>
    },
    groupChange: function(event){
        var groupId = event.target.value;
        var userId = this.props.userid;
        Meteor.call("changeUserGroup", userId, groupId, function(err, groupName){
            if (err){
                console.error(err.reason);
                toastr.error(err.reason);
            } else {
                toastr.success("Added user to " + groupName);
            }
        });
    },
    render: function(){
        var {userid, avatar, personName, role, active, voted, group, ordered} = this.props;
        return <div className="panel panel-default">
            <div className='panel-heading clearfix'>
                <h3 className='panel-title pull-left'>
                    <img
                        src={avatar}
                        height="24"
                        width="24"
                        className='no-space'
                        />
                    &nbsp;&mdash;&nbsp; {personName}
                </h3>
                <div className='pull-right'>
                    {role}
                </div>
            </div>
            <div className="panel-body container-fluid">
                <div className='row'>
                    <div className="col-md-1"><b>Voted:&nbsp;</b>{voted ? 'Yes' : 'No'}</div>
                    <div className="col-md-1"><b>Ordered:&nbsp;</b>{ordered ? 'Yes' : 'No'}</div>
                    <div className="col-md-2"> {this.renderCheckbox('Active', active, userid)}</div>
                    <div className="col-md-3">
                        <span><b>Office:&nbsp;</b></span>
                        <select onChange={this.groupChange} value={group}>
                            <option value='0'>Select One</option>
                            {this.state.groups.map(this.renderOption)}
                        </select>
                    </div>
                </div>
            </div>


        </div>
    }
});
