Template.topics.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <TopicsList />,
          document.getElementById('yield')
        );
    }
}
