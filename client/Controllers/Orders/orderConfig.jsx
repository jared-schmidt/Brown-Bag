Template.orders.rendered = function(){
    if (Meteor.userId()) {
        React.render(
          <OrdersList />,
          document.getElementById('yield')
        );
    }
}
