if (Meteor.isServer) {
    Meteor.methods({
        addMessage: function(message){
            var user = Meteor.user();

            if (user.roles != 'admin'){
                throw new Meteor.Error(422, 'Must be an admin to add');
            }

            if (!message){
                throw new Meteor.Error(422, 'No Message text found');
            }
            var user = Meteor.user();
            if(user.hasOwnProperty('group')){
                var userGroup = Groups.findOne({'_id': user.group});
            }
            if (userGroup && userGroup.name.toLowerCase() !== 'johnstown'){
                throw new Meteor.Error(422, 'George the cat says NO!');
            }

            var messageId = Messages.insert({
                'message': message,
                'usersClosed': [],
                'display': true,
                'addedBy': user._id,
                'createdOn': new Date()
            });
            return messageId;

        },
        deleteMessage: function(messageId){
            var user = Meteor.user();

            var user = Meteor.user();
            if(user.hasOwnProperty('group')){
                var userGroup = Groups.findOne({'_id': user.group});
            }
            if (userGroup && userGroup.name.toLowerCase() !== 'johnstown'){
                throw new Meteor.Error(422, 'George the cat says NO!');
            }

            if (user.roles != 'admin'){
                throw new Meteor.Error(422, 'Must be an admin to add');
            }

            if (!messageId){
                throw new Meteor.Error(422, 'No Message id found');
            }

            Messages.remove(messageId);
        },
        userClosed: function(messageId){
            var user = Meteor.user();
            var user = Meteor.user();
            if(user.hasOwnProperty('group')){
                var userGroup = Groups.findOne({'_id': user.group});
            }
            if (userGroup && userGroup.name.toLowerCase() !== 'johnstown'){
                throw new Meteor.Error(422, 'George the cat says NO!');
            }

            Messages.update(messageId, {
                $addToSet: {'usersClosed': user._id}
            });
        }
    });
}
