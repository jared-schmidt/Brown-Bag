UserHeader = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function(){
        return {
            totalActiveUsers: Meteor.users.find({'profile.active': true}).count(),
            totalUsers: Meteor.users.find({}).count(),
            isAdmin: Meteor.user().roles === 'admin'
        }
    },
    createGroup: function(){

        var groups = Groups.find({}).fetch();
        var groupsStringHTML = '<ul>';
        _.each(groups, function(group){
            groupsStringHTML += '<li>'+group.name+'</li>'
        });
        groupsStringHTML += '</ul>';

        bootbox.dialog({
                title: "Create Office",
                message: '<div class="row">  ' +
                    '<div class="col-md-12"> ' +
                    '<form class="form-horizontal"> ' +
                    '<div class="form-group"> ' +
                    '<label class="col-md-4 control-label" for="name">Office Name:</label> ' +
                    '<div class="col-md-4"> ' +
                    '<input id="groupName" name="groupName" type="text" placeholder="Office Name" class="form-control input-md"> ' +
                    '<span class="help-block">Enter a new office name</span> </div> ' +
                    '</div> ' +
                    '<div>' +
                    '<h5>Existing Office(s)</h5>' +
                    groupsStringHTML +
                    '</div>' +
                    // '<div class="form-group"> ' +
                    // '<label class="col-md-4 control-label" for="awesomeness">How awesome is this?</label> ' +
                    // '<div class="col-md-4"> <div class="radio"> <label for="awesomeness-0"> ' +
                    // '<input type="radio" name="awesomeness" id="awesomeness-0" value="Really awesome" checked="checked"> ' +
                    // 'Really awesome </label> ' +
                    // '</div><div class="radio"> <label for="awesomeness-1"> ' +
                    // '<input type="radio" name="awesomeness" id="awesomeness-1" value="Super awesome"> Super awesome </label> ' +
                    // '</div> ' +
                    '</div> </div>' +
                    '</form> </div>  </div>',
                buttons: {
                    success: {
                        label: "Save",
                        className: "btn-success",
                        callback: function () {
                            var groupName = $('#groupName').val();
                            Meteor.call('createGroup', groupName, function(err, groupName){
                                if (err){
                                    console.error(err.reason);
                                    toastr.error(err.reason);
                                } else {
                                    toastr.success("Created new group " + groupName);
                                }
                            });
                        }
                    }
                }
            }
        );
    },
    renderGroupButton: function(){
        return <div>
            <button className="btn btn-primary" onClick={this.createGroup}>New Office</button>
        </div>
    },
    render: function(){
        return <div className="group-header">
            <div className="title-bar row">
                <span className="count col-sm-4">{this.data.totalActiveUsers ? this.data.totalActiveUsers : 0} of {this.data.totalUsers ? this.data.totalUsers : 0} User(s) Active</span>
            </div>
            {this.data.isAdmin ? this.renderGroupButton() : null}
        </div>
    }
});
