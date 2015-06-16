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
    render: function(){
        var {userid, avatar, personName, role, active, voted, ordered} = this.props;
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
                    </div>
                </div>
        </div>
    }
});
