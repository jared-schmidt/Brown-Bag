Template.places.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <PlacesList />,
          document.getElementById('yield')
        );
    }
}
