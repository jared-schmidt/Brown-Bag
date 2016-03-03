Router.configure({
    layoutTemplate: 'layout'
});

// Router.onBeforeAction('loading', {except: ['api_winning']});

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
        onBeforeAction:mustLogIn,
        action: loading,
        onStop: function(){
            React.unmountComponentAtNode(document.getElementById('yield'));
        },
        fastRender: true
    });

    this.route('topics', {
        path:'/topics',
        onBeforeAction:mustLogIn,
        action: loading,
        onStop: function(){
            React.unmountComponentAtNode(document.getElementById('yield'));
        },
        fastRender: true
    });

    this.route('orders',{
        path:'/orders',
        action: loading,
        onBeforeAction:mustLogIn,
        onStop: function(){
            React.unmountComponentAtNode(document.getElementById('yield'));
        },
        fastRender: true
    });

    this.route('users',{
        path:'/users',
        action: loading,
        onBeforeAction:mustLogIn,
        onStop: function(){
            React.unmountComponentAtNode(document.getElementById('yield'));
        },
        fastRender: true
    });

    this.route('messages', {
        path:'/messages',
        action: loading,
        onBeforeAction:mustLogIn,
        onStop: function(){
            React.unmountComponentAtNode(document.getElementById('yield'));
        },
        fastRender: true
    });

    this.route('releases', {
        path: '/releases',
        action: loading,
        onStop: function(){
            React.unmountComponentAtNode(document.getElementById('yield'));
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
            var model = {};
            model.items = Urls.find({},{sort:{'votes': -1}});
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
        waitOn:function(){
            return Meteor.subscribe('pastOrders');
        },
        data: function(){
            model = {};

            Meteor.call('getUserInfo', function(err, user){
                Session.set('user', user);
            });
            var user = Session.get('user');
            model.orders = PastOrders.find({'userID': Meteor.user()._id});
            model.user = user;
            return model;
        },
        fastRender: true
    });

    this.route('no', {
        name: 'no',
        path: '/no',
        onBeforeAction: mustLogIn,
        fastRender: true,
        layoutTemplate: 'noLayout'
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
        // Meteor.call("checkUserGroup", Meteor.userId(), function(err, isGood){
        //     console.log(isGood);
        //     if (!isGood){
        //         Router.go('no');
        //     }
        // });
        this.next();
    }
}
