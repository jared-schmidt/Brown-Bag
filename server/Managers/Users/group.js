function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

Meteor.methods({
    createGroup: function(groupName){
        if (Meteor.user().roles === 'admin'){
            if (groupName){

                groupName = toTitleCase(groupName);

                var existingGroup = Groups.findOne({'name': groupName});
                if(!existingGroup){
                    var groupId = Groups.insert({
                        'name' : groupName,
                        'createdOn' : new Date()
                    });
                    return groupName;
                }
                throw new Meteor.Error(422, 'A group by that name already exists.');
            }
            throw new Meteor.Error(422, 'Group name is missing.');
        }
        throw new Meteor.Error(422, 'Must be an admin.');
    },
    changeUserGroup: function(userID, groupID){
        if (Meteor.user().roles === 'admin'){
            var group = Groups.findOne({'_id': groupID});

            if(group){
                Meteor.users.update({'_id': userID}, {$set:{
                    'group': group._id
                }}, {upsert: true});
                return group.name;
            }
            throw new Meteor.Error(422, 'Could not find that group.');
        }
        throw new Meteor.Error(422, 'Must be an admin to change group.');
    }
});
