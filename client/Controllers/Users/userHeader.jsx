UserHeader = ReactMeteor.createClass({
    getMeteorState: function(){
        return {
            totalUsers: Meteor.users.find({'profile.active': true}).count()
        }
    },
    render: function(){
        return <div className="group-header">
            <div className="title-bar row">
                <span className="count col-sm-4">{this.state.totalUsers} User(s) Active</span>
            </div>
        </div>
    }
});
