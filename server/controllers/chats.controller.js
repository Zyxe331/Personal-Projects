const chatServices = require('../services/chats.service.js');
const contentCycleServices = require('../services/content_cycles.service')
const userServices = require('../services/users.service');

const notificationTypeIds = {
    'RequestToJoinGroup': 1,
    'AcceptToGroup': 2,
    'DeclineToGroup': 3,
    'Nudge': 4,
    'RemoveFromGroup': 5
}

const getCurrentUserGroupInformation = async (request, response) => {
    try {

        let userid = request.params.userid;

        let responseBody = {
            currentUserHasGroup: null,
            currentGroup: null,
            userHasPlans: [],
            groupUsers: []
        }

        let userHasGroup = await chatServices.getCurrentUserHasGroup(userid);
        console.log(userHasGroup);
        responseBody.currentUserHasGroup = userHasGroup;
        console.log(responseBody);

        let group = await chatServices.getCurrentGroup(userHasGroup.Group_Id);
        responseBody.currentGroup = group;

        let userHasGroups = await chatServices.getUserGroups(group.Id, userid);
        
        if (userHasGroups.length == 0 ) {
            return response.status(200).send(responseBody);
        }
        
        // Organize information for user and user has plans queries
        let userIds = userHasGroups.map(userHasGroup => userHasGroup.User_Id);
        let userHasPlanIds = userHasGroups.map(userHasGroup => userHasGroup.User_has_Plan_Id);

        let groupUsers = await chatServices.getUsers(userIds);
        responseBody.groupUsers = groupUsers;

        let userHasPlans = await chatServices.getUserPlans(userHasPlanIds);
        responseBody.userHasPlans = userHasPlans;

        // Send success message
        return response.status(200).send(responseBody);
    } catch (error) {
        console.log(error);
        return response.status(500).send('Something went wrong internally');
    }
}

const requestJoinGroupController = async (request, response) => {
    try {

        console.log('test')
        let groupNumber = request.params.groupNumber;
        let userid = request.body.userId;

        let adminUser = await userServices.findAdminUserForGroup(groupNumber);
        let requestingUser = await userServices.findUserById(userid);
        console.log(adminUser);
        console.log(requestingUser)

        let title = `${requestingUser.FirstName} ${requestingUser.LastName} is requesting to join your group!`;
        let body = `Please notify ${requestingUser.FirstName} if you would like to add them to your group. If you don't know who this is or do not want them in your group reject them.`;
        let notification = await chatServices.createNotification(title, body, requestingUser.Id, adminUser.Id, notificationTypeIds.RequestToJoinGroup, groupNumber);

        console.log(notification);
        // Send success message
        return response.status(200).send({ notification });
    } catch (error) {
        console.log(error);
        return response.status(500).send('Something went wrong internally');
    }
}

const officiallyJoinGroup = async (request, response) => {
    try {

        let groupNumber = request.params.groupNumber;
        let notificationId = request.body.notificationId;
        let requestingUserId = request.body.requestingUserId;
        let adminUserId = request.body.adminUserId;
        let accepted = request.body.accepted;

        if (!accepted) {

            let title = `You were rejected from group with code: ${groupNumber}`;
            let body = `The administrator of the group you requested to join has declined your request.`;
            let notification = await chatServices.createNotification(title, body, adminUserId, requestingUserId, notificationTypeIds.DeclineToGroup, groupNumber);
            await chatServices.updateNotification(notificationId, 1, 1);
            // Send success message
            return response.status(200).send(true);
        }

        await contentCycleServices.deactivateActiveUserHasPlans(requestingUserId);

        await chatServices.deactivateActiveUserHasGroups(requestingUserId);

        let group = await chatServices.getCurrentGroup(groupNumber);

        let firstSection = await contentCycleServices.getFirstSectionOfPlan(group.Plan_Id);

        let userHasPlan = await contentCycleServices.createUserHasPlan(requestingUserId, group.Plan_Id, firstSection.Id);

        let userHasGroupId = await chatServices.createUserHasGroup(requestingUserId, group.Id, userHasPlan.Id, 2);

        let title = `You have been accepted to ${group.Name}!`;
        let body = `You have been added to ${group.Name}. Have fun with your knew group and make sure to keep each other accountable!`;
        let notification = await chatServices.createNotification(title, body, adminUserId, requestingUserId, notificationTypeIds.AcceptToGroup, groupNumber);
        await chatServices.updateNotification(notificationId, 1, 1);
        // Send success message
        return response.status(200).send(true);
    } catch (error) {
        console.log(error);
        return response.status(500).send('Something went wrong internally');
    }
}

const getCurrentUserNotifications = async (request, response) => {
    try {
        let userid = request.params.userid;
        let notifications = await chatServices.queryUserNotifications(userid);

        // Send success message
        return response.status(200).send(notifications);
    } catch (error) {
        return response.status(500).send('Something went wrong internally');
    }
}

const updateNotificationController = async (request, response) => {
    try {
        let notificationId = request.params.notificationId;
        let completed = request.body.completed;
        let read = request.body.read;
        let notifications = await chatServices.updateNotification(notificationId, read, completed);

        // Send success message
        return response.status(200).send({});
    } catch (error) {
        return response.status(500).send('Something went wrong internally');
    }
}

const nudgeUserController = async (request, response) => {
    try {
        let receivingUserId = request.params.userToNudgeId;
        let sendingUserId = request.body.currentUserId;

        let sendingUser = await userServices.findUserById(sendingUserId);
        let title = `${sendingUser.FirstName} nudged you!`;
        let body = `${sendingUser.FirstName} nudged you! Make sure you are keeping up with your plan.`;
        let notification = await chatServices.createNotification(title, body, sendingUserId, receivingUserId, notificationTypeIds.Nudge, null);

        // Send success message
        return response.status(200).send({});
    } catch (error) {
        return response.status(500).send('Something went wrong internally');
    }
}

const updateGroupController = async (request, response) => {
    try {
        let groupId = request.params.groupId;
        let name = request.body.name;

        let group = await chatServices.updateGroup(groupId, name);

        if (group) {

            // Send success message
            return response.status(200).send(group);

        }
    } catch (error) {
        return response.status(500).send('Something went wrong internally')
    }
}

const removeUserController = async (request, response) => {

    try {
        let removedUserId = request.params.userId;
        let groupId = request.params.groupId;
        let adminUserId = request.body.adminUserId;

        await contentCycleServices.deactivateActiveUserHasPlans(removedUserId);
        await chatServices.deactivateActiveUserHasGroups(removedUserId);
        let group = await chatServices.getCurrentGroup(groupId);

        let title = `You have been removed from ${group.Name}`;
        let body = `You have been removed from your group ${group.Name}. Please contact the administor of this group to find out why.`;
        await chatServices.createNotification(title, body, adminUserId, removedUserId, notificationTypeIds.RemoveFromGroup, groupId);

        // Send success message
        return response.status(200).send({});

    } catch (error) {
        console.log(error);
        return response.status(500).send('Something went wrong internally')
    }

}

const readNotificationsController = async (request, response) => {
    try {
        let notificationIds = request.body.notificationIds;
        let read = request.body.read;
        
        let notifications = await chatServices.updateNotifications(notificationIds, read);

        // Send success message
        return response.status(200).send(notifications);
    } catch (error) {
        return response.status(500).send('Something went wrong internally');
    }
}

module.exports = {
    getCurrentUserGroupInformation: getCurrentUserGroupInformation,
    requestJoinGroupController: requestJoinGroupController,
    getCurrentUserNotifications: getCurrentUserNotifications,
    officiallyJoinGroup: officiallyJoinGroup,
    updateNotificationController: updateNotificationController,
    nudgeUserController: nudgeUserController,
    updateGroupController: updateGroupController,
    removeUserController: removeUserController,
    readNotificationsController: readNotificationsController
}