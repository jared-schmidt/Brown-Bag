if (Meteor.isServer) {
    Meteor.startup(function (){

        console.log(Meteor.settings.found_file);

        var yelp = Meteor.npmRequire('yelp').createClient({
            consumer_key: 'WDYAKycarqBqWcfxtrwccQ',
            consumer_secret: '3CtLvBMCISjIlXUQ0MlNyAzvmxg',
            token: 'Yw_FZ2UJ-yXa_ck5A1zWuRkTW7yn9OaW',
            token_secret: '2Bxoraz5ZAjVjZ8yMzUkATunDRY'
        });

        if (Places.find().count() === 0){
            console.log('No places, querying yelp');
            yelp.search({
                term: 'food',
                location: '15904',
                sort: 2
            }, Meteor.bindEnvironment(function(error, data) {
                if (data.businesses) {
                    var places_data = data.businesses;
                    console.log('Found ' + places_data.length + ' places.');
                    for (var i = 0; i < places_data.length; i++) {
                        var place = places_data[i];
                        Places.insert({
                            username: 'yelp',
                            name: place.name,
                            votes: 0,
                            upvoters: [],
                            menu: place.url,
                            submittedOn: new Date(),
                            datePicked : []
                        });
                    }
                }
            }));
        }
    });
}
