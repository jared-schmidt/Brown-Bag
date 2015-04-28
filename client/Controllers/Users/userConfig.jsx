Template.users.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <UserList />,
          document.getElementById('yield')
        );
    }
}
