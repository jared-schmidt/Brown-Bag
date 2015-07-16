var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

Template.releases.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <Releases />,
          document.getElementById('yield')
        );
    }
}

Releases = ReactMeteor.createClass({
    componentWillMount:function(){
        Meteor.call('getReleases', function(err, data){
            if (err){

            } else {
                Session.set('data', data);
            }
        });
    },
    getMeteorState:function(){
        return {
            'data': Session.get('data')
        }
    },
    renderRelease:function(model, index){
        return <Release
            key={model.tag_name}
            title={model.name}
            version={model.tag_name}
            body={model.body}
            dateCreated={model.created_at}
        />
    },
    render: function(){

        return <div className='container-fluid'>

            {
                this.state.data
            ?
                <ReactCSSTransitionGroup transitionName="example">
                    {this.state.data.map(this.renderRelease)}
                </ReactCSSTransitionGroup>
            :
                "Loading..."
            }

        </div>
    }
});

Release = ReactMeteor.createClass({
    render: function(){
        var displayDate = moment(this.props.dateCreated).format('MMMM Do YYYY');
        var rawMarkup = marked(this.props.body.toString(), {sanitize: true});

        return <div className='panel panel-default'>
            <div className='panel-heading clearfix'>

                <h3 className='panel-title pull-left'>
                    {this.props.title}
                </h3>

                <div className='pull-right'>
                    <span className='gray'><i>{displayDate}</i></span>
                    <span>&nbsp;&nbsp;&nbsp;&mdash;&nbsp;&nbsp;&nbsp;</span>
                    <span>{this.props.version}</span>
                </div>

            </div>
            <div className="panel-body">
                <h5><b>Notable Changes</b></h5>
                <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
            </div>
        </div>
    }
});
