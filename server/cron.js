if (Meteor.isServer) {


    SyncedCron.config({
        // Log job run details to console
        log: true,

        // Use a custom logger function (defaults to Meteor's logging package)
        logger: null,

        // Name of collection to use for synchronisation and logging
        collectionName: "cronHistory",

        // Default to using localTime
        utc: false,

        /*
          TTL in seconds for history records in collection to expire
          NOTE: Unset to remove expiry but ensure you remove the index from
          mongo by hand

          ALSO: SyncedCron can't use the `_ensureIndex` command to modify
          the TTL index. The best way to modify the default value of
          `collectionTTL` is to remove the index by hand (in the mongo shell
          run `db.cronHistory.dropIndex({startedAt: 1})`) and re-run your
          project. SyncedCron will recreate the index with the updated TTL.
        */
        collectionTTL: 172800
    });

    // 1:00pm = 9:00am (13 hour)
    // 2:00pm = 10:00am (14 hour)
    // 3:00pm = 11:00am (15 hour)
    // 4:00pm = 12:00pm (16 hour)
    // 5:00pm = 1:00pm (17 hour)
    // 6:00pm = 2:00pm (18 hour)
    // 7:00pm = 3:00pm (19 hour)
    // 8:00pm = 4:00pm (20 hour)

    SyncedCron.add({
        name: 'almost closing time',
        schedule: function(parser) {
            return parser.text('at 2:00pm on wed');
        },
        job: function() {
            var message = '@Group: Time to vote for the Brown Bag!';
            slackMessage(message);
        }
    });


    SyncedCron.add({
        name: 'almost closing time',
        schedule: function(parser) {
            return parser.text('at 6:00pm on wed');
        },
        job: function() {
            var message = '@Group: Voting is closing in 30 minutes.';
            slackMessage(message);
        }
    });

    SyncedCron.add({
        name: 'current standings',
        schedule: function(parser) {
            return parser.text('at 6:20pm on wed');
        },
        job: function() {
            var message = '@Group: Current standings.\n';
            var places = Places.find({}, {
                sort: {
                    'votes': -1
                }
            }).fetch();
            for (var p in places) {
                var name = places[p].name;
                var votes = places[p].votes;
                if (votes > 0) {
                    message += name + ' -> ' + votes + '\n';
                }
            }

            slackMessage(message);
        }
    });

    // SyncedCron.add({
    //     name: 'closing time',
    //     schedule: function(parser) {
    //         return parser.text('at 6:30pm on wed');
    //     },
    //     job: function() {
    //         Meteor.call("endPlaceVoting", function(err, placeId) {
    //             var message = '@Group: Voting has ended!';
    //             slackMessage(message);
    //         });
    //     }
    // });

    SyncedCron.add({
        name: 'reset site',
        schedule: function(parser) {
            return parser.text('at 9:00pm on thurs');
        },
        job: function() {
            // var message = '@Group: Brown-bag site has been';
            // bot_talk(message, officeChatId);
            Meteor.call("clearAll");
        }
    });

    if (isProdEnv()){
        SyncedCron.start();
    }

}
