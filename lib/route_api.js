if (Meteor.isServer) {
    function api_key_in_use(api_key) {

        console.log("IN USE?")
        var user = Meteor.users.find({
            'api.api_id': api_key
        });
        if (user) {
            if (user.hasOwnProperty('api')) {
                if (user.api.confirmed) {
                    return true;
                }
            }
        }
        return false;
    }

    function api_auth(api_key) {
        console.log(api_key);
        var user = Meteor.users.findOne({
            'api.api_id': api_key
        });
        console.log(user);
        if (user) {
            if (user.hasOwnProperty('api')) {
                if (user.api.confirmed) {
                    console.log("Found user");
                    return user;
                }
                return "API not confirmed!";
            }
            return "API not setup for user";
        }
        console.log("No User found!");
        return false;
    }

    function api_output(request, message) {

        var out_obj = {
            'message': message
        }

        request.response.setHeader("Content-Type", "application/json");
        request.response.setHeader("Access-Control-Allow-Origin", "*");
        request.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        request.response.end(JSON.stringify(out_obj));
    }
}

Router.route('connect', {
    where: 'server',
    path: '/api/v2/connect'
}).post(function() {
    var json_data = this.request.body;

    if (json_data) {
        if (json_data['email'] && json_data['api_key']) {
            user = Meteor.users.findOne({
                'profile.email': json_data['email']
            });
            var api_key = json_data['api_key'];
            if (user) {
                // console.log("Found user");
                if (user.api) {
                    if (user.api.confirmed) {
                        message = "You are already connected.";
                    } else {
                        if (!api_key_in_use()) {
                            Meteor.users.update(user._id, {
                                $set: {
                                    'api': {
                                        'api_id': api_key,
                                        'confirmed': false
                                    }
                                }
                            });
                            message = "Please confirm the connect in the setting on the website.";
                        } else {
                            message = "API KEY IN USE!";
                        }
                    }
                } else {
                    if (!api_key_in_use()) {
                        Meteor.users.update(user._id, {
                            $set: {
                                'api': {
                                    'api_id': api_key,
                                    'confirmed': false
                                }
                            }
                        });
                        message = "Please confirm the connect in the setting on the website.";
                    } else {
                        message = "API KEY IN USE!";
                    }
                }
            }
        } else {
            message = "Fields not found!";
        }
    } else {
        message = "No Json Found!";
    }
    // this.response.end(message);
    api_output(this, message);
});

Router.route('hello', {
        where: 'server',
        path: '/api/v2/hello'
    })
    .get(function() {
        var message = 'Hello!'
        api_output(this, message);
    })
    .post(function() {
        var json_data = this.request.body;

        var user = api_auth(json_data['api_key']);

        var message = '';
        if (user) {
            message = 'Welcome ' + user.profile.name + '! You are all set!'
        } else {
            message = 'Yeah, no. You are not ready for this!'
        }

        api_output(this, message);
    });

Router.route('winning', {
        where: 'server',
        path: '/api/v2/winning'
    })
    .post(function() {
        var json_data = this.request.body;

        var user = api_auth(json_data['api_key']);

        var message = '';
        if (user) {
            if (user.roles == 'admin') {
                place = Places.findOne({}, {
                    sort: {
                        'votes': -1
                    }
                });
                message = place.name + " is currently winning.";
            } else {
                message = "Your no admin!";
            }
        } else {
            message = 'Yeah, no. You are not ready for this!';
        }

        api_output(this, message);
    });


Router.route('votes', {
        where: 'server',
        path: '/api/v2/votes'
    })
    .post(function() {
        var json_data = this.request.body;

        var user = api_auth(json_data['api_key']);

        var message = '';
        if (user) {
            if (user.roles == 'admin') {
                var places = Places.find({}, {
                    sort: {
                        'votes': -1
                    }
                }).fetch();
                for (var p in places) {
                    // console.log(p);
                    var name = places[p].name;
                    var votes = places[p].votes;

                    _.each(places[p].voters, function(voter){
                        var vote_user = Meteor.users.findOne({'_id': voter});

                        if (!vote_user.canVote){
                            votes -= 1;
                        }
                    });

                    if (votes > 0) {
                        message += name + ' -> ' + votes + '\n';
                    }
                }
            } else {
                message = "Your no admin!";
            }
        } else {
            message = 'Yeah, no. You are not ready for this!';
        }
        api_output(this, message);
    });



Router.route('order', {
        where: 'server',
        path: '/api/v2/order'
    })
    .post(function() {
        var json_data = this.request.body;

        var user = api_auth(json_data['api_key']);

        var text = false;
        if (json_data.hasOwnProperty('text')) {
            text = json_data['text'];
        }

        var message = '';
        if (user) {
            if (text) {
                ordered_already = Orders.findOne({
                    'name': user.profile.name
                });
                if (!ordered_already) {
                    var orderId = Orders.insert({
                        'name': user.profile.name,
                        'food': text,
                        'submittedOn': new Date()
                    });
                    message = "Your order has been placed!";
                } else {
                    message = "You already ordered!";
                }
            } else {
                message = "You forgot to include your order";
            }
        } else {
            message = 'Yeah, no. You are not ready for this!';
        }
        api_output(this, message);
    });



// Can't have route end in a 's'?
// Could not get "orders" or "foods" to work....Broke the site.. No Idea...
Router.route('food', {
        where: 'server',
        path: '/api/v2/food'
    })
    .post(function() {
        var json_data = this.request.body;

        var user = api_auth(json_data['api_key']);

        var message = '';
        if (user) {
            if (user.roles == 'admin') {
                var orders = Orders.find({}).fetch();
                message = '';
                for (var i = 0; i < orders.length; i++) {
                    message += orders[i].name + ' -> ' + orders[i].food
                }
                if (message == '') {
                    message = 'Nothing Ordered...'
                }
            } else {
                message = "Your no admin!";
            }
        } else {
            message = 'Yeah, no. You are not ready for this!';
        }
        api_output(this, message);
    });


Router.route('api_winning', {
        where: 'server',
        path: '/api/v1/winning'
    })
    .get(function() {
        console.log("GET Test");
        this.response.end('get request\n');
    })
    .post(function() {
        var json_data = this.request.body;

        var trigger = json_data['trigger_word']

        var slack_id = json_data['user_id'];
        var slack_token = json_data['token'];

        var text = json_data['text'].replace(trigger, '');
        var command = '';
        if (text.length > 0) {
            var command = String(text.split(' ')[1]);
            command = command.replace(',', '');
            command = command.trim();
            command = command.toLowerCase();
        }

        var message = 'Try using a command like "' + trigger + ' commands"';
        if (command) {
            text = text.replace(trigger, '');
            text = text.replace(command, '');
            text = text.trim();

            switch (command) {
                case 'help':
                case 'commands':
                    message = 'whoami - checks if you are connected to brown-bag site. \n';
                    message += 'winning - Returns the place that is currectly winning in the brown-bag site. \n';
                    message += 'want {text} - Places your order to the brown-bag site \n';
                    message += 'orders - List all the current orders \n';
                    break;

                case 'winning':
                    // place = Places.findOne({},{sort:{'votes': -1}});
                    // message = place.name + " is currently winning.";
                    message = "Yeah, no."
                    break;
                case 'whoami':
                    user = Meteor.users.findOne({
                        'api.slack_id': slack_id
                    });
                    if (user) {
                        message = "You are " + user.profile.name;
                    } else {
                        message = "Use the connect function";
                    }
                    break;
                case 'want':
                    user = Meteor.users.findOne({
                        'api.slack_id': slack_id
                    });
                    if (user) {
                        ordered_already = Orders.findOne({
                            'name': user.profile.name
                        });
                        if (!ordered_already) {
                            var orderId = Orders.insert({
                                'name': user.profile.name,
                                'food': text,
                                'submittedOn': new Date()
                            });
                            message = user.profile.name + "'s order has been placed!"
                        } else {
                            message = "You already ordered!";
                        }
                    } else {
                        message = "Use the connect function";
                    }

                    break;
                case 'orders':
                    var orders = Orders.find({}).fetch();
                    message = '';
                    for (var i = 0; i < orders.length; i++) {
                        message += orders[i].name + ' : ' + orders[i].food
                    }
                    if (message == '') {
                        message = 'Nothing Ordered...'
                    }
                    break;
                default:
                    message = 'Not sure what ' + command + ' is.';
            }
        }

        var out_obj = {
            'text': message
        }

        this.response.setHeader("Content-Type", "application/json");
        this.response.setHeader("Access-Control-Allow-Origin", "*");
        this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        this.response.end(JSON.stringify(out_obj));

    });
