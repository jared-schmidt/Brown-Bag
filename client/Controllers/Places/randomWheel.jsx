var cx = React.addons.classSet;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

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
