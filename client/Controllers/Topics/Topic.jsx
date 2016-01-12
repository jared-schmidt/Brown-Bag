var cx = React.addons.classSet;

Topic = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData: function(){
      return {
        hasWinner: Topics.findOne({'winner': 1}) ? true : false,
        isAdmin: Meteor.user().roles === 'admin'
      }
    },
    voteTopic: function(id, didVote){
        if(Meteor.userId()){
            if (!didVote)
                Meteor.call("voteUpTopic", id, function(err, data){
                    if (err){
                        console.error(err);
                        toastr.error(err.reason, "Error!");
                    } else {
                        Session.set('totalVotesTopic', Session.get('totalVotesTopic') + 1);
                        console.log("voted");
                        toastr.success("You voted!", "Voted!");
                    }
                });
            else {
                Meteor.call("removeVoteTopic", id,function(err, data){
                    if (err){
                        console.error(err);
                        toastr.error(err.reason, "Error!");
                    } else {
                        Session.set('totalVotesTopic', Session.get('totalVotesTopic') - 1);
                        console.log("removed vote");
                        toastr.warning("You removed your vote!", "Warning!");
                    }
                });
            }
        }
    },
    deleteTopic: function(id){
        Meteor.call("removeTopic", id, function(err){
            if(err){
                console.error(err);
                toastr.error(err.reason, "Error!");
            }
        });
    },
    render: function(){
        var {topicid, name, menu, votes, isWinner, didVote, votedFor} = this.props;
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
        if (didVote || this.data.hasWinner){
            upVoteDisabled['disabled'] = 'disabled';
        }

        var downVoteDisabled = {}
        if (this.data.hasWinner){
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
                            <ul>
                                <li>URL: <b>{this.props.url || 'No URL'}</b></li>
                                <li>Submitted By: <b>{this.props.username}</b></li>
                            </ul>
                        </div>
                        <div className='panel-heading clearfix'>
                            {didVote && votedFor ?
                                <button {...downVoteDisabled} onClick={this.voteTopic.bind(this, topicid, didVote)} className="btn btn-warning">
                                    <span className="mdi-action-thumb-down"></span>
                                </button>
                                :
                                <button  {...upVoteDisabled} onClick={this.voteTopic.bind(this, topicid, didVote)} className="btn btn-success">
                                    <span className='mdi-action-thumb-up'></span>
                                </button>
                            }
                            {this.data.isAdmin ?
                                <button onClick={this.deleteTopic.bind(this, topicid)} className="btn btn-danger">
                                    <span className='mdi-action-delete'></span>
                                </button>
                                :
                                null
                            }
                            <h3 className='panel-title pull-right'>
                                Votes: {this.data.isAdmin || this.data.hasWinner ? votes : '?'}
                            </h3>
                        </div>
                    </div>
                </div>
    }
});
