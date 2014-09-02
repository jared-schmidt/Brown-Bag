Router.configure({
    layoutTemplate: 'layout'
});

Router.onBeforeAction('loading');

Router.map(function(){
    this.route('home', {
        path:'/',
        action: loading,
        onBeforeAction:mustLogIn,
    });
    this.route('places', {
        path:'/places',
        waitOn: function(){
            return Meteor.subscribe('places');
        },
        action: loading,
        onBeforeAction:mustLogIn,
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
        action: loading,
        onBeforeAction:mustLogIn,
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
        action: loading,
        onBeforeAction:mustLogIn,
        data:function(){
            var model = {}
            model['items'] = Urls.find({},{sort:{'votes': -1}});
            return model;
        }
    });

    this.route('watch', {
        path: '/watch/:_id',
        waitOn:function(){
            return Meteor.subscribe('urls');
        },
        action: loading,
        onBeforeAction:mustLogIn,
        data: function() {
            return Urls.findOne(this.params._id);
        }
    });
});

function loading(){
    if (this.ready())
      this.render();
    else
      this.render('loading');
}

function mustLogIn(pause){
    var routeName = this.route.name;

    if (_.include(['login'], routeName))
        return;

    if (! Meteor.userId()) {
        this.setLayout("loginLayout");
        this.render('login');

        //if you have named yields it the login form
        //this.render('loginForm', {to:"formRegion"});

        //and finally call the pause() to prevent further actions from running
        pause();
    }else{
        this.setLayout(this.lookupLayoutTemplate());
    }
};