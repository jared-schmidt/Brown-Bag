Meteor.methods({
    'getReleases': function(){
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
