Router.route('api_winning', {
    where: 'server',
    path: '/api/v1/winning'
  })
  .get(function () {
    console.log("GET Test");
    this.response.end('get request\n');
  })
  .post(function () {
    var json_data = this.request.body;

    var trigger = json_data['trigger_word']

    var slack_id = json_data['user_id'];
    var slack_token = json_data['token'];

    var text = json_data['text'].replace(trigger, '');
    var command = '';
    if (text.length > 0){
        console.log(text)
        var command = String(text.split(' ')[1]);
        console.log("command -> " + command)
        command = command.replace(',', '');
        command = command.trim();
    }

    var message = 'Try using a command like "'+trigger+' commands"';
    if (command){
        text = text.replace(trigger, '');
        text = text.replace(command, '');
        text = text.trim();

        switch(command){
            case 'commands':
                message = 'help, whoami, winning, URL, about, want {text}, orders, pirate {text}, number, connect {email}';
                break;
            case 'connect':
                console.log(text);
                if (text){
                    user = Meteor.users.findOne({'profile.email': text + '@problemsolutions.net'});
                    if (user){
                        console.log("Found user");
                        if (user.profile.api){
                            if (user.profile.api.confirmed){
                                message = "You are already connected.";
                            }
                            else{
                                Meteor.users.update(user._id,{
                                    $set:{'api' : {'slack_id' : slack_id, 'slack_token':slack_token, 'slack_username':json_data['user_name'],'confirmed': false }}
                                });
                                message = "Please confirm the connect in the setting on the website.";
                            }
                        }
                        else{
                           Meteor.users.update(user._id,{
                               $set:{'api' : {'slack_id' : slack_id, 'slack_token':slack_token, 'slack_username':json_data['user_name'],'confirmed': false }}
                           });
                           message = "Please confirm the connect in the setting on the website.";
                         }
                    }
                }
                else{
                    message = "Please include the beginning of your email address (without the '@problemsolutions.net') to connect to.";
                }
                break;
            case 'help':
                message = 'Should I call 911?';
                break;
            case 'winning':
                place = Places.findOne({},{sort:{'votes': -1}});
                message = place.name + " is currently winning.";
                break;
            case 'whoami':
                // message = 'You are ' + json_data['user_name']
                user = Meteor.users.findOne({'api.slack_id':slack_id});
                if (user){
                    message = "You are " + user.profile.name;
                }
                else{
                    message = "Use the connect function";
                }
                break;
            case 'about':
                message = 'This is a message comming from brown-bag.meteor.com';
                break;
            case 'want':
                user = Meteor.users.findOne({'api.slack_id':slack_id});
                if (user){
                    ordered_already = Orders.findOne({'name': user.profile.name});
                    if(!ordered_already){
                        var orderId = Orders.insert({
                            'name' : user.profile.name,
                            'food' : text,
                            'submittedOn' : new Date()
                        });
                        message = user.profile.name +"'s order has been placed!"
                        }
                        else{
                            message = "You already ordered!";
                        }
                }
                else{
                    message = "Use the connect function";
                }



                break;
            case 'orders':
                var orders = Orders.find({}).fetch();
                message = '';
                for (var i=0; i<orders.length;i++){
                    message += orders[i].name + ' : ' + orders[i].food
                }
                if (message == ''){
                    message = 'Nothing Ordered...'
                }
                break;
            case 'URL':
                message = 'brown-bag.meteor.com';
                break;
            case 'pirate':
                var url = "http://isithackday.com/arrpi.php?format=json&" + q_string({'text':text.trim()});
                console.log(url);
                var req = Meteor.http.get(url);
                var j_data =req.data;
                message = j_data['translation']['pirate'];
                break;
            case 'number':
                var url = 'http://numbersapi.com/random?json';
                var req = Meteor.http.get(url);
                var j_data =req.data;
                message = j_data['text'];
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