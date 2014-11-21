Router.configure({
    layoutTemplate: 'layout'
});

Router.onBeforeAction('loading', {except: ['api_winning']});

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

    this.route('watch_video', {
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
        }
    });

    // this.route('users',{
    //     path:'/users',
    //     action: loading,
    //     onBeforeAction:mustLogIn,
    //     data: function(){
    //         console.log(Meteor.users.find({}));
    //         var model = {}
    //         model['users'] = Meteor.users.find({});
    //         return model;
    //     }
    // });



});

Router.route('api_winning', {
    where: 'server',
    path: '/api/v1/winning'
  })
  .get(function () {
    console.log("GET Test");
    this.response.end('get request\n');
  })
  .post(function () {
    console.log("POST Test");
    var json_data = this.request.body;

    var out_obj = {
        'text' : 'Hello ' + json_data['user_name'] + '. You said ' + json_data['text']
    }

    this.response.setHeader("Content-Type", "application/json");
    this.response.setHeader("Access-Control-Allow-Origin", "*");
    this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    this.response.end(JSON.stringify(out_obj));


    // var url = "https://hooks.slack.com/services/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";
    // var message = "Let's find out who the winner is.... (Comming Soon!)";
    // var payload = {
    //     "username": "Brown-Bag",
    //     "icon_emoji": ":ghost:",
    //     "text": message
    // }

    // var result = Meteor.http.post(url,{
    //     data: payload
    // });
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