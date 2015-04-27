var cx = React.addons.classSet;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

PlacesList = ReactMeteor.createClass({
    // Can't use this with iron router
    // templateName: "places",

    startMeteorSubscriptions: function() {
       Meteor.subscribe('places');
     },
    getMeteorState: function(){
        return {
            places: Places.find({}, {sort: {name: 1}}).fetch(),
            didVote: Places.findOne({'upvoters' : {"$in" : [Meteor.user()._id]}})
        }
    },
    shouldComponentUpdate: function(){
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
    getInitialState: function(){
        return {places: []};
    },
    renderHeader: function(model){
        return <PlacesHeader />
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
