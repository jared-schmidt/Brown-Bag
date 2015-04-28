UserHeader = ReactMeteor.createClass({
    getMeteorState: function(){
        return {
            totalUsers: Session.get('totalUsers'),
        }
    },
    componentWillMount: function(){
        Meteor.call('getTotalActiveUsers', function(err, result){
            if (err){
                console.error(err);
            }
            Session.set('totalUsers', result);
        });
    },
    getInitialState: function () {
        return {
            totalUsers: 0
        };
    },
    render: function(){
        return <div className="group-header">
            <div className="title-bar row">
                <span className="count col-sm-4">{this.state.totalUsers} User(s) Active</span>
            </div>
        </div>
    }
});
