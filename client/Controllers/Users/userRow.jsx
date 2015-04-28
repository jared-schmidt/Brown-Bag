UserRow = React.createClass({
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
          <b>{label}:</b>
          <br/>
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
    render: function(){
        var {userid, avatar, personName, role, active, voted, ordered} = this.props;
        return <div className="panel panel-default">
                <div className="panel-body container-fluid">
                    <div className='row'>
                        <div className="col-md-1">
                            <img
                                src={avatar}
                                height="64"
                                width="64"
                                className='no-space'
                             />
                        </div>
                        <div className="col-md-4"><b>Name:</b><br/>{personName}</div>
                        <div className="col-md-1"><b>Role:</b><br/>{role}</div>
                        <div className="col-md-1"><b>Voted:</b><br/>{voted ? 'Yes' : 'No'}</div>
                        <div className="col-md-1"><b>Ordered:</b><br/>{ordered ? 'Yes' : 'No'}</div>
                        <div className="col-md-4"> {this.renderCheckbox('Active', active, userid)}</div>
                    </div>
                </div>
        </div>
    }
});
