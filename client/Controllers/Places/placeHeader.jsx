var cx = React.addons.classSet;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

PlacesHeader = ReactMeteor.createClass({
    getMeteorState: function(){
        return {
            placesCount: Places.find().count(),
            totalUsers: Session.get('totalUsers'),
            totalVoted: Session.get('totalVotes')
        }
    },
    componentWillMount: function(){
        Meteor.call('getTotalActiveUsers', function(err, result){
            if (err){
                console.error(err);
            }
            Session.set('totalUsers', result);
        });

        Meteor.call('getTotalVotes', function(err, result){
            if (err){
                console.error(err);
            }
            Session.set('totalVotes', result);
        });
    },
    componentDidMount: function () {
        $.material.input();
    },
    getInitialState: function(){
        return {
            placesCount: 0,
            totalVoted: 0,
            totalUsers: 0
        };
    },
    addNewPlace: function(){

        var user = Meteor.user();
        if (!user){
            return;
        }

        var place = document.getElementById("place").value;
        var menu = document.getElementById("menu").value;

        if (place && menu){
            Meteor.call("addPlace", user.profile.name, place, menu, function(err, placeId){
                if(err){
                    console.error(err);
                }
            });

            document.getElementById("place").value = '';
            document.getElementById("menu").value = '';
        } else {
            toastr.error("Need to have a name and a menu", "Error!");
        }
    },
    render: function(){
        return <div className="group-header">
                    <div className="title-bar row">
                        <span className="count col-sm-4">{this.state.placesCount} Place(s) Registered</span>
                        <span className="count col-sm-4"> {this.state.totalVoted} of {this.state.totalUsers} Vote(s) </span>
                    </div>
                    <div className="entry form-horizontal">
                        <div className="col-sm-5">
                            <input data-hint="some hint" type='text' placeholder="Where at..." id="place" className="form-control floating-label" />
                        </div>
                        <div className="col-sm-5">
                            <input data-hint="some hint" type='text' placeholder="What they have..." id="menu" className="form-control floating-label" />
                        </div>
                        <div className="col-sm-2">
                            <input onClick={this.addNewPlace} type="button" className='btn btn-success' id='submitPlace' value="Submit" />
                        </div>
                    </div>
                <RandomWheel />
                </div>
    }
});
