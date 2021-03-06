var cx = React.addons.classSet;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

PlacesList = React.createClass({
    // Can't use this with iron router
    // templateName: "places",
    mixins: [ReactMeteorData],
    getMeteorData: function(){
        Meteor.subscribe("places");
        return {
            places: Places.find({}, {sort: {name: 1}}).fetch(),
            didVote: Places.findOne({'upvoters' : {"$in" : [Meteor.user()._id]}})
        }
    },
    shouldComponentUpdate: function(){
        return true;
    },
    renderPlace: function(model, index){
        var didVote = this.data.didVote;
        console.log(model);
        return <Place
            key={model._id}
            placeid = {model._id}
            name = {model.name}
            menu = {model.menu}
            votes = {model.votes}
            isWinner = {model.winner ? true : false}
            didVote = {didVote ? true : false}
            votedFor = {didVote && didVote._id === model._id} />
    },
    renderHeader: function(model){
        return <PlacesHeader />
    },
    render: function(){
        return <div> {this.renderHeader(this.state)}
                    <div className="inner">
                        <div className='container-fluid'>
                            <ReactCSSTransitionGroup transitionName="example">
                                {this.data.places.map(this.renderPlace)}
                            </ReactCSSTransitionGroup>
                        </div>
                    </div>
                </div>;
    }
});
