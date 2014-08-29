Router.configure({layoutTemplate: 'layout'});

Router.map(function(){
    this.route('home', {
        path:'/'
    });
    this.route('places', {
        path:'/places',
        waitOn: function(){
            return Meteor.subscribe('places');
        },
        data: function(){
            var model = {}
            model['items'] = Places.find({}, {sort:{'votes': -1}});
            return model;
        }
    });
    this.route('orders',{
        path:'/orders',
        waitOn:function(){
            return Meteor.subscribe('orders');
        },
        data:function(){
            var model = {}
            model['items'] = Orders.find({},{sort:{'submittedOn': -1}});
            return model;
        }
    });
    this.route('urls',{
        path:'/urls',
        waitOn:function(){
            return Meteor.subscribe('urls');
        },
        data:function(){
            var model = {}
            model['items'] = Urls.find({},{sort:{'votes': -1}});
            return model;
        }
    });
});