Template.no.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <No />,
          document.getElementById('yield')
        );
    }
}

No = ReactMeteor.createClass({
    render: function(){
        return <div className="center-text">
            <h3 className="animated bounce">
            You can not vote. Your are not part of the correct Group/Office.
            </h3>
            <br />
            <span id="talkToAdmin" className="animated swing">Talk to an Admin of the site if you should be able to vote!</span>
            <br />
            <br />
            <img src='/cat.jpg' />
        </div>
    }
});
