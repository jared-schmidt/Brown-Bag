Template.messages.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <MessagesList />,
          document.getElementById('yield')
        );
    }
}
