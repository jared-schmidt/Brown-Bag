var cx = React.addons.classSet;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

Template.places.rendered = function(){
    if (Meteor.userId()) {
        React.render(React.createElement(PlacesList), document.getElementById('yield'));
    }
}

PlacesList = ReactMeteor.createClass({
    // Can't use this with iron router
    // templateName: "places",

    startMeteorSubscriptions: function() {
       Meteor.subscribe('places');
     },

    getMeteorState: function(){
        console.log("get Meteor state");
        return {
            places: Places.find({}, {sort: {name: 1}}).fetch(),
            didVote: Places.findOne({'upvoters' : {"$in" : [Meteor.user()._id]}})
        }
    },
    shouldComponentUpdate: function(){
        console.log('shouldComponentUpdate Places list');
        return true;
    },
    renderPlace: function(model, index){
        var didVote = this.state.didVote;

        return <Place
            key={index}
            placeid = {model._id}
            name = {model.name}
            isWinner = {model.winner ? true : false}
            didVote = {didVote ? true : false}
            votedFor = {didVote && didVote._id === model._id}
            />
    },
    componentDidMount: function(){
        console.log('didMount List');
    },
    componentWillMount: function(){
        console.log("willMount List");
    },
    componentWillUnmount: function(){
        console.log("will unmount");
    },
    componentDidUnmount: function(){
        console.log("did unmount");
    },
    componentWillUpdate: function(){
        console.log('componentWillUpdate list');
    },
    componentDidUpdate: function(){
        console.log('componentDidUpdate list');
    },
    getInitialState: function(){
        // console.log("init places");
        return {places: []};
    },
    renderHeader: function(model){
        return <PlacesHeader
                />
    },
    render: function(){
        return <div> {this.renderHeader(this.state)}
                    <div className="inner">
                        <div className='container-fluid'>
                            <ReactCSSTransitionGroup transitionName="example">
                                {this.state.places.map(this.renderPlace)}
                            </ReactCSSTransitionGroup>
                        </div>
                    </div>
                </div>;
    }
});



PlacesHeader = ReactMeteor.createClass({
    getMeteorState: function(){
        return {
            placesCount: Places.find().count(),
            totalUsers: Session.get('totalUsers'),
            totalVoted: Session.get('totalVotes')
        }
    },
    componentDidMount: function(){
        console.log('didMount PlacesHeader');
    },
    componentWillMount: function(){
        console.log("willMount PlacesHeader");

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
    componentWillUnmount: function(){
        console.log("will unmount PlacesHeader");
    },
    componentDidUnmount: function(){
        console.log("did unmount PlacesHeader");
    },
    componentWillReceiveProps: function(){
        console.log('WillReceiveProps PlacesHeader')
    },
    // shouldComponentUpdate: function(){
    //     console.log('shouldComponentUpdate PlacesHeader');
    // },
    componentWillUpdate: function(){
        console.log('componentWillUpdate PlacesHeader');

        // Meteor.call('getTotalActiveUsers', function(err, result){
        //     Session.set('totalUsers', result);
        // });

        // Meteor.call('getTotalVotes', function(err, result){
        //     Session.set('totalVotes', result);
        // });
    },
    componentDidUpdate: function(){
        console.log('componentDidUpdate PlacesHeader');
    },
    getInitialState: function(){
        console.log("init PlacesHeader");
        return {placesCount: 0};
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
                            <input type='text' placeholder="Where at..." id="place" className="form-control" />
                        </div>
                        <div className="col-sm-5">
                            <input type='text' placeholder="What they have..." id="menu" className="form-control" />
                        </div>
                        <div className="col-sm-2">
                            <input onClick={this.addNewPlace} type="button" className='btn btn-success' id='submitPlace' value="Submit" />
                        </div>
                    </div>
                <RandomWheel />
                </div>
    }
});


RandomWheel = React.createClass({
    onRandomBtnClick: function(){
        wheel.init();

        // var segments = new Array();
        var places = Places.find({}, {fields: {'name': 1}}).fetch();
        var segments = [];

        $.each(places, function(index, obj) {
            segments.push(obj.name);
        });

        wheel.segments = segments;
        wheel.update();

        // Hide the address bar (for mobile devices)!
        // setTimeout(function() {
        //     window.scrollTo(0, 1);
        // }, 0);
    },
    renderModal: function(){
        return <div className="modal fade bs-example-modal-lg" id='wheelModal' tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <h4 className="modal-title" id="myModalLabel"><b>Click the wheel to spin!</b></h4>
                            </div>
                            <div className="modal-body">
                                <div id="wheel" >
                                    <canvas id="canvas" width="1000" height="600"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
    },
    render: function(){
        return <div>
                    <button onClick={this.onRandomBtnClick} className="btn btn-primary" id='openRandom' data-toggle="modal" data-target=".bs-example-modal-lg">Open Random Wheel</button>
                    {this.renderModal()}
               </div>
    }
});


Place = React.createClass({
    // getInitialState: function(){
    //     console.log("here");
    //     return {
    //         placeid: 0,
    //         name: 'Loading...',
    //         isWinner: false,
    //         didVote: false,
    //         votedFor: 0
    //     }
    // },
    // componentDidMount: function(){
    //     console.log('did Mount place');
    // },
    // componentWillMount: function(){
    //     console.log("will Mount palce")
    // },
    // componentWillUnmount: function(){
    //     console.log("will unmount place");
    // },
    // componentDidUnmount: function(){
    //     console.log("did unmount place");
    // },
    votePlace: function(id, didVote){
        if(Meteor.userId()){
            if (!didVote)
                Meteor.call("voteUp", id, function(err, data){
                    if (err){
                        console.error(err);
                        toastr.error(err.reason, "Error!");
                    } else {
                        Session.set('totalVotes', Session.get('totalVotes') + 1);
                        console.log("voted");

                    }
                });
            else {
                Meteor.call("removeVote", id,function(err, data){
                    if (err){
                        console.error(err);
                        toastr.error(err.reason, "Error!");
                    } else {
                        Session.set('totalVotes', Session.get('totalVotes') - 1);
                        console.log("removed vote");
                    }
                });
            }
        }
    },
    render: function(){
        var {placeid, name, isWinner, didVote, votedFor} = this.props;
        var cardClasses = cx({
            'panel': true,
            'panel-default': true,
            'panel-success': this.props.isWinner
        });

        var voteBtnIconClasses = cx({
            'mdi-action-thumb-up': !didVote,
            'mdi-action-thumb-down': didVote,
        });

        var voteBtnClasses = cx({
            'btn': true,
            'btn-success': !didVote,
            'btn-warning': didVote
        });

        var upVoteDisabled = {};
        if (didVote){
            upVoteDisabled['disabled'] = 'disabled';
        }

        var downVoteDisabled = {}
        if (isWinner){
            downVoteDisabled['disabled'] = 'disabled';
        }

        return <div className='col-xs-12 col-md-4'>
                    <div className={cardClasses}>
                        <div className='panel-heading clearfix'>
                            <h3 className='panel-title pull-left'>
                                {name}
                            </h3>
                        </div>
                        <div className="panel-body">
                            {didVote && votedFor ?
                                <button {...downVoteDisabled} onClick={this.votePlace.bind(this, placeid, didVote)} className="btn btn-warning">
                                    <span className="mdi-action-thumb-down"></span>
                                </button>
                                :
                                <button  {...upVoteDisabled} onClick={this.votePlace.bind(this, placeid, didVote)} className="btn btn-success">
                                    <span className='mdi-action-thumb-up'></span>
                                </button>
                            }
                        </div>
                    </div>
                </div>
    }
});
