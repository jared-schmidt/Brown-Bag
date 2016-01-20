var cx = React.addons.classSet;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

TopicsList = React.createClass({
    // Can't use this with iron router
    // templateName: "topics",
    mixins: [ReactMeteorData],
    getMeteorData: function(){
        Meteor.subscribe("topics");
        Meteor.subscribe("pastTopics");

        return {
            topics: Topics.find({}, {sort: {name: 1}}).fetch(),
            didVote: Topics.findOne({'upvoters' : {"$in" : [Meteor.user()._id]}}),
            past: PastTopics.find({}, {sort: {name: 1}}).fetch()
        }
    },
    shouldComponentUpdate: function(){
        return true;
    },
    rendertopic: function(model, index){
        var didVote = this.data.didVote;
        return <Topic
            key={model._id}
            topicid = {model._id}
            name = {model.name}
            url = {model.url}
            username= {model.username}
            votes = {model.votes}
            isWinner = {model.winner ? true : false}
            didVote = {didVote ? true : false}
            votedFor = {didVote && didVote._id === model._id} />
    },
    renderHeader: function(model){
        return <TopicsHeader />
    },
    render: function(){
        return <div>
            {this.renderHeader(this.state)}
            <div className="inner">
                <div className='container-fluid'>
                    <ReactCSSTransitionGroup transitionName="example">
                        {this.data.topics.map(this.rendertopic)}
                    </ReactCSSTransitionGroup>
                    <h3>Past Topics</h3>
                    <ReactCSSTransitionGroup transitionName="example">
                        {this.data.past.map(this.rendertopic)}
                    </ReactCSSTransitionGroup>
                </div>
            </div>
        </div>;
    }
});
