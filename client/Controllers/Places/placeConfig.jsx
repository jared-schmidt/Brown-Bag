Template.places.rendered = function(){
    if (Meteor.userId()) {
        React.render(React.createElement(PlacesList), document.getElementById('yield'));
    }
}
