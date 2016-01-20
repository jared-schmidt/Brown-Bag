if (Meteor.isServer) {
    Meteor.methods({
        addUrl : function(username, url){
            var user = Meteor.user();
            if(user.hasOwnProperty('group')){
                var userGroup = Groups.findOne({'_id': user.group});
            }
            if (userGroup && userGroup.name.toLowerCase() !== 'johnstown'){
                throw new Meteor.Error(422, 'George the cat says NO!');
            }
            var displayUrl = url;
            var embedUrl = url;
            var embeddable = false;
            for (var i = 0; i < videoUrlParsers.length; i++) {
                var parser = videoUrlParsers[i];
                if (parser.canParseUrl(url)) {
                    embedUrl = parser.getEmbedUrl(url);
                    embeddable = true;
                    break;
                }
            }

            if (!embeddable) {
                if (url.indexOf('//') < 0) {
                    url = '//' + url;
                }
            }

            var urlId = Urls.insert({
                'username' : username,
                'displayUrl' : displayUrl,
                'url' : url,
                'embedUrl' : embedUrl,
                'embeddable' : embeddable,
                'votes' : 0,
                'upvoters' : [],
                'submittedOn' : new Date()
            });
            return urlId;
        }
    });
}
