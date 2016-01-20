Meteor.methods({
    'getReleases': function(){
        var user = Meteor.user();
        if(user.hasOwnProperty('group')){
            var userGroup = Groups.findOne({'_id': user.group});
        }
        if (userGroup && userGroup.name.toLowerCase() !== 'johnstown'){
            throw new Meteor.Error(422, 'George the cat says NO!');
        }
        var url = "https://api.github.com/repos/jared-schmidt/brown-bag/releases";

        var options = {
            'headers': {
                "user-agent": "Meteor1.0"
            }
        }

        var resp = HTTP.get(url, options);

        return resp.data;
    }
});
