var cx = React.addons.classSet;

Place = ReactMeteor.createClass({
    getMeteorState: function(){
      return {
        hasWinner: Places.findOne({'winner': 1}) ? true : false,
        isAdmin: Meteor.user().roles === 'admin'
      }
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
                        toastr.success("You voted!", "Voted!");
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
                        toastr.warning("You removed your vote!", "Warning!");
                    }
                });
            }
        }
    },
    deletePlace: function(id){
        Meteor.call("removePlace", id, function(err){
            if(err){
                console.error(err);
                toastr.error(err.reason, "Error!");
            }
        });
    },
    render: function(){
        var {placeid, name, menu, votes, isWinner, didVote, votedFor} = this.props;
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
        if (didVote || this.state.hasWinner){
            upVoteDisabled['disabled'] = 'disabled';
        }

        var downVoteDisabled = {}
        if (this.state.hasWinner){
            downVoteDisabled['disabled'] = 'disabled';
        }

        return <div className='col-xs-12 col-md-4'>
                    <div className={cardClasses}>
                        <div className='panel-heading clearfix'>
                            <h3 className='panel-title pull-left'>
                                <a href={menu} _target='_blank'>{name}</a>
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
                            {this.state.isAdmin ?
                                <button onClick={this.deletePlace.bind(this, placeid)} className="btn btn-danger">
                                    <span className='mdi-action-delete'></span>
                                </button>
                                :
                                null
                            }
                        </div>
                        <div className='panel-heading clearfix'>
                            <h3 className='panel-title pull-right'>
                                Votes: {this.state.isAdmin || this.state.hasWinner ? votes : '?'}
                            </h3>
                        </div>
                    </div>
                </div>
    }
});
