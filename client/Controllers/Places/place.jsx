var cx = React.addons.classSet;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

Place = React.createClass({
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
