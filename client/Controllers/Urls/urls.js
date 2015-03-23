if (Meteor.isClient) {

    function validateURL(textval) {
        var urlregex = new RegExp( "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
        return urlregex.test(textval);
    }

    Template.urls.events({
        'click #submitUrl':function(event){
            event.preventDefault();
            console.log("submitted url");

            var user = Meteor.user();
            if(!user){
                return;
            }

            var url = document.getElementById("url").value;
            //if (validateURL(url)){
            Meteor.call("addUrl", user.profile.name, url, function(err, urlId){
                console.log('added url');
            });
            document.getElementById("url").value;
            // }
            // else{
            //     alert("not a url")
            // }
        }
    });

    Template.urls.items = function(){
        return Urls.find({}, {sort:{'votes':-1}});
    };
};