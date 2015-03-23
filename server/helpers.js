if (Meteor.isServer) {

    //util that will return any url parameters.
    //in key value pairs (ex. ..?a=b&c=d will be in format of {a: b, c: d})
    var getUrlParams = function(url) {
        var params = url.split('?');
        if (params.length == 2) {
            params = params[1].split('&');
            var p = {};
            for (var i = 0; i < params.length; i++) {
                var param = params[i].split('=');
                if(param.length == 2) {
                    p[param[0]] = param[1];
                }
            }
            return p;
        } else {
            return {};
        }
    };

    //TODO add additional parsers here; vimeo, etc.
    var videoUrlParsers = [
        {
            name: 'YouTube',
            canParseUrl: function(url) {
                return url.indexOf('youtube.com') >= 0;
            },
            getEmbedUrl: function(url) {
                var videoId = getUrlParams(url)['v'];
                if (videoId) {
                    return '//youtube.com/embed/' + videoId;
                } else {
                    //want to ensure we don't specify protocol
                    var parts = url.split('youtube.com');
                    return '//youtube.com/' + parts[parts.length - 1];
                }
            }
        }
    ];

}