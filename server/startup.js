if (Meteor.isServer) {
    Meteor.startup(function (){

        if (!Meteor.settings.found_file){
            console.error("SETTINGS -> NO SETTINGS FILE FOUND");
            throw new Meteor.Error(0, 'NO SETTINGS FILE FOUND');
        } else {
            console.log("SETTINGS -> Settings file found.")
        }

        var yelp = Meteor.npmRequire('yelp').createClient({
            consumer_key: Meteor.settings.yelpConsumerKey,
            consumer_secret: Meteor.settings.yelpConsumerSecret,
            token: Meteor.settings.yelpToken,
            token_secret: Meteor.settings.yelpTokenSecret
        });

        if (Places.find().count() === 0){
            console.log('No places, querying yelp');
            yelp.search({
                term: 'food',
                location: Meteor.settings.yelpZipCode,
                sort: 2
            }, Meteor.bindEnvironment(function(error, data) {
                if (data.businesses) {
                    var places_data = data.businesses;
                    console.log('Found ' + places_data.length + ' places.');
                    for (var i = 0; i < places_data.length; i++) {
                        var place = places_data[i];
                        Meteor.call('addPlace', 'YELP', place.name, place.url, function(err, data){
                            if (err){
                                console.error(err);
                            }
                        });
                    }
                }
            }));
        }
    });
}
