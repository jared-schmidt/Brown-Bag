var cx = React.addons.classSet;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

TopicsHeader = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function(){
        return {
            topicsCount: Topics.find().count(),
            totalUsers: Session.get('totalUsers'),
            totalVoted: Session.get('totalVotes'),
            isAdmin: Meteor.user().roles === 'admin'
        }
    },
    getCounts: function(){
        Meteor.call('getTotalActiveUsers', function(err, result){
            if (err){
                console.error(err);
            }
            Session.set('totalUsers', result);
        });

        Meteor.call('getTotalVotesTopics', function(err, result){
            if (err){
                console.error(err);
            }
            Session.set('totalVotes', result);
        });
    },
    componentWillMount: function(){
        this.getCounts();
    },
    componentWillUpdate: function(){
        this.getCounts();
    },
    componentDidMount: function () {
        $.material.input();
    },
    addNewtopic: function(){

        var user = Meteor.user();
        if (!user){
            return;
        }

        var topic = document.getElementById("topic").value;
        var url = document.getElementById("url").value;

        if (topic){
            Meteor.call("addTopic", user.profile.name, topic, url, function(err, topicId){
                if(err){
                    console.error(err);
                }
            });

            document.getElementById("topic").value = '';
            document.getElementById("url").value = '';
        } else {
            toastr.error("Need to have a name", "Error!");
        }
    },
    renderNewtopic: function(){
        return <div className="entry form-horizontal">
            <div className="col-sm-5">
                <input data-hint="some hint" type='text' placeholder="Topic" id="topic" className="form-control floating-label" />
            </div>
            <div className="col-sm-5">
                <input data-hint="some hint" type='text' placeholder="Url (optional)" id="url" className="form-control floating-label" />
            </div>
            <div className="col-sm-2">
                <input onClick={this.addNewtopic} type="button" className='btn btn-success' id='submittopic' value="Submit" />
            </div>
        </div>
    },
    render: function(){
        return <div className="group-header">
                    <div className="title-bar row">
                        <span className="count col-sm-4">{this.data.topicsCount} topic(s) Registered</span>
                        <span className="count col-sm-4"> {this.data.totalVoted} of {this.data.totalUsers} Vote(s) </span>
                    </div>
                    {this.renderNewtopic()}
                </div>
    }
});
