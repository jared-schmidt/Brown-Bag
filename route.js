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

    var trigger = json_data['trigger_word']


    var text = json_data['text'].slice(trigger.length);
    var command = '';
    if (text.length > 0){
        var command = String(text.split(' '[0]));
        command = command.replace(',', '');
    }

    var message = 'Try using a command like "'+trigger+' commands"';
    if (command){
        console.log(command)
        switch(command){
            case 'commands':
                message = 'help, whoami, winning, URL, about, commands';
                break;
            case 'help':
                message = 'Should I call 911?';
                break;
            case 'winning':
                message = "Some day I will be able to tell you, but not now."
                break;
            case 'whoami':
                message = 'You are ' + json_data['user_name']
                break;
            case 'about':
                message = 'This is a message comming from brown-bag.meteor.com';
                break;
            case 'URL':
                message = 'brown-bag.meteor.com';
                break;
            default:
                message = 'Not sure what '+command+' is.';
        }
    }

    var out_obj = {
        'text' : message
    }

    this.response.setHeader("Content-Type", "application/json");
    this.response.setHeader("Access-Control-Allow-Origin", "*");
    this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    this.response.end(JSON.stringify(out_obj));



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