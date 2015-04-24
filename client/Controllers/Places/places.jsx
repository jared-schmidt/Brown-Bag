var cx = React.addons.classSet;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var PlacesList = ReactMeteor.createClass({
    // Can't use this with iron router
    // templateName: "places",

    getMeteorState: function(){
        return {
            places: Places.find({}, {sort: {name: 1}}).fetch(),
            placesCount: Places.find().count(),
            didVote: Places.findOne({'upvoters' : {"$in" : [Meteor.user()._id]}})
        }
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
        console.log('didMount');
    },
    componentWillMount: function(){
        console.log("willMount")
    },
    componentWillUnmount: function(){
        console.log("will unmount");
    },
    componentDidUnmount: function(){
        console.log("did unmount");
    },
    getInitialState: function(){
        console.log("init places");
        return {places: []};
    },
    render: function(){
        return <div> {this.state.   placesCount}
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







var Place = React.createClass({
    // getInitialState: function(){
    //     console.log("here");
    //     return <div>Loading...</div>;
    // },
    componentDidMount: function(){
        console.log('did Mount place');
    },
    componentWillMount: function(){
        console.log("will Mount palce")
    },
    componentWillUnmount: function(){
        console.log("will unmount place");
    },
    componentDidUnmount: function(){
        console.log("did unmount place");
    },
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

Router.map(function(){
    this.route('places', {
        path:'/places',
        waitOn:function(){
            return Meteor.subscribe('places');
        },
        onBeforeAction:mustLogIn,
        action: loading,
        onAfterAction: function(){
            if (Meteor.userId()) {
                React.render(<PlacesList />, document.getElementById('yield'));
            }
        },
        onStop: function(){
            React.unmountComponentAtNode(document.getElementById('yield'));
        }
    });
});

function loading(){
    if (this.ready())
      this.render();
    else
      this.render('loading');
}

function mustLogIn(pause){
    if (! Meteor.userId()) {
        this.layout("loginLayout");
        this.render('login');
      } else {
        this.next();
      }
};