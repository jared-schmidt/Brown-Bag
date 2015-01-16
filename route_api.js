function q_string(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

function draco_language(message){
    var url = "http://isithackday.com/arrpi.php?format=json&" + q_string({'text':message.trim()});
    var req = Meteor.http.get(url);
    var j_data =req.data;
    return j_data['translation']['pirate'];
}

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
        var command = String(text.split(' ')[1]);
        command = command.replace(',', '');
        command = command.trim();
        command = command.toLowerCase();
    }

    var message = 'Try using a command like "'+trigger+' commands"';
    if (command){
        text = text.replace(trigger, '');
        text = text.replace(command, '');
        text = text.trim();

        switch(command){
            case 'help':
            case 'commands':
                message = 'whoami - checks if you are connected to brown-bag site. \n';
                message += 'winning - Returns the place that is currectly winning in the brown-bag site. \n';
                message += 'URL - Returns the URL for the brown-bag site. \n';
                message += 'want {text} - Places your order to the brown-bag site \n';
                message += 'orders - List all the current orders \n';
                message += 'number - Gives a random fact about a random number. \n';
                message += 'connect {email} - Connects slack to the brown-bag site. \n';
                message += 'chuck - Give a random Chuck Norris fact. \n';
                message += 'pirate {text} - Converts your text to pirate talk. \n';
                message += 'cowsay {text} - Places your text in a bubble a cow is saying. \n';
                message += 'quote - Returns a random quote.\n';
                message += 'catfact - Returns a random cat fact. \n';
                message += 'gif {text} - Returns a gif based on your text. \n';
                message += 'about - about. \n';
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
            case 'winning':
                place = Places.findOne({},{sort:{'votes': -1}});
                message = place.name + " is currently winning.";
                break;
            case 'whoami':
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
            case 'url':
                message = 'brown-bag.meteor.com';
                break;
            case 'pirate':
                var url = "http://isithackday.com/arrpi.php?format=json&" + q_string({'text':text.trim()});
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
            case 'cowsay':
                var url = 'http://cowsay.morecode.org/say?format=text&' + q_string({'message':text.trim()});
                var req = Meteor.http.get(url);
                message = req.content;
                break;
            case 'catfact':
                var url = 'http://catfacts-api.appspot.com/api/facts?number=1'
                var req = Meteor.http.get(url);
                var j_data = JSON.parse(req.content);

                message = j_data['facts'][0];
                break;
            case 'chuck':
                //?firstName=John&lastName=Doe
                var url = 'http://api.icndb.com/jokes/random'
                try{
                    var req = Meteor.http.get(url);
                    var j_data =req.data;
                    message = j_data['value']['joke'];
                } catch(e){
                    message = "API is down. Try again later, or don't";
                }
                break;
            case 'quote':
                var url = 'http://www.iheartquotes.com/api/v1/random?format=json'
                var req = Meteor.http.get(url);
                var j_data =req.data;
                message = j_data['quote'];
                break;
            case 'gif':
                var offset = Math.floor((Math.random() * 10) + 1); //random number between 1 and 10
                var url = 'http://api.giphy.com/v1/gifs/translate?'+q_string({'s':text.trim()})+'&api_key=dc6zaTOxFJmzC&limit=1&offset='+offset
                console.log(url);
                var req = Meteor.http.get(url);
                var j_data =req.data;
                console.log(j_data);
                message = j_data['data']['images']['original']['url'];
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