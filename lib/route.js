Router.configure({
    layoutTemplate: 'layout'
});

Router.onBeforeAction('loading', {except: ['api_winning']});

// http://stackoverflow.com/questions/13151879/publish-certain-information-for-meteor-users-and-more-information-for-meteor-use

Router.map(function(){
    this.route('home', {
        path:'/',
        action: loading,
        onBeforeAction:mustLogIn,
        fastRender: true
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
            model['items'] = Places.find({}, {sort:{'name': 1}});
            return model;
        },
        fastRender: true
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
        },
        fastRender: true
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
        },
        fastRender: true
    });

    this.route('watch_video', {
        path: '/watch/:_id',
        waitOn:function(){
            return Meteor.subscribe('urls');
        },
        action: loading,
        onBeforeAction:mustLogIn,
        data: function() {
            return Urls.findOne(this.params._id);
        },
        fastRender: true
    });

    this.route('settings',{
        path: '/settings',
        action: loading,
        onBeforeAction:mustLogIn,
        data: function(){
            Meteor.call('getUserInfo', function(err, user){
                Session.set('user', user);
            });
            var user = Session.get('user');
            return user;
        },
        fastRender: true
    });

    this.route('users',{
        path:'/users',
        action: loading,
        onBeforeAction:mustLogIn,
        waitOn:function(){
            return Meteor.subscribe('userData');
        },
        data: function(){
            var model = {}
            model['items'] = Meteor.users.find({}, {sort:{'roles': 1, 'profile.active': -1, 'profile.family_name': 1}}).fetch();
            return model;
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
    if (! Meteor.userId()) {
        this.layout("loginLayout");
        this.render('login');
      } else {
        this.next();
      }

    // var routeName = this.route.name;

    // if (_.include(['login'], routeName))
    //     return;

    // if (! Meteor.userId()) {
    //     this.setLayout("loginLayout");
    //     this.render('login');

    //     //if you have named yields it the login form
    //     //this.render('loginForm', {to:"formRegion"});

    //     //and finally call the pause() to prevent further actions from running
    //     pause();
    // }else{
    //     this.setLayout(this.lookupLayoutTemplate());
    // }
};

