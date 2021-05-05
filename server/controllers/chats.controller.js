/**
 * chats.controller.js
 * 
 * The chats controller encompasses the JavaScript logic that controls any functionality with chats.
 * 
 */

const chatServices = require('../services/chats.service.js');
const contentCycleServices = require('../services/content_cycles.service')
const userServices = require('../services/users.service');

const notificationTypeIds = {
    'RequestToJoinGroup': 1,
    'AcceptToGroup': 2,
    'DeclineToGroup': 3,
    'Nudge': 4,
    'RemoveFromGroup': 5,
    'Prayer': 6
}

//Assigns variables to queries that gathers the information for a user's group
const getCurrentUserGroupInformation = async (request, response) => {
    try {

        let userid = request.params.userid;
        let groupId = request.params.groupId
        let responseBody = {
            currentUserHasGroup: null,
            currentUserHasPlan: null,
            currentGroup: null,
            userHasPlans: [],
            groupUsers: []
        }

        let userHasGroup = await chatServices.getCurrentUserHasGroup(userid);
        responseBody.currentUserHasGroup = userHasGroup;

        let group = await chatServices.getCurrentGroup(groupId);
        responseBody.currentGroup = group;

        let userHasGroups = await chatServices.getUserHasGroupForGivenGroup(groupId);
        if (userHasGroups.length == 0 ) {
            return response.status(200).send(responseBody);
        }
        
        // Organize information for user and user has plans queries
        // let userIds = userHasGroups.map(userHasGroup => userHasGroup.User_Id);
        let userHasPlanIds = userHasGroups.map(userHasGroup => userHasGroup.User_has_Plan_Id);

        let groupUsers = await chatServices.getUsersOfGroup(groupId);
        responseBody.groupUsers = groupUsers.filter(user => user.Id != userid); //remove current user from list of members

        let userHasPlans = await chatServices.getUserPlans(userHasPlanIds);
        responseBody.userHasPlans = userHasPlans;
        responseBody.currentUserHasPlan = userHasPlans.find(hasPlan => hasPlan.User_Id == userid)

        // Send success message
        return response.status(200).send(responseBody);
    } catch (error) {
        console.log(error);
        return response.status(500).send('Something went wrong internally');
    }
}

const getCurrentUsersGroupsController = async (req, res) => {
    try {
        let groups = await chatServices.getUsersGroups(req.params.userid)
        res.status(200).send(groups)
    }
    catch (err) {
        res.status(500).send(`Something went wrong getting a user's plans: ${err.message}`)
    }
}

//Gathers information for the user that is utilized for queries that logically handles a user requesting a group admin to join said group.
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

//Gathers information for the user that is utilized for queries that logically handles a user joining a group.
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

//Queries any notifications assigned to the user
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

//Queries any notifications that have been read by the user
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

//Gathers information necessary for to create a notification for a user that states someone else nudged them.
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

//Controller that utilizes a query to change the name of a given group.
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

const getGroupController = async (request, response) => {
    try {
        let userId = request.params.userId;
        let name = request.body.name;
        let groups = await chatServices.getUserGroups(userId);

        if (groups) {
            // Send success message
            return response.status(200).send(groups);

        }
    } catch (error) {
        return response.status(500).send('Something went wrong internally')
    }
}

//Gathers and utilizes information that creates a notification to tell a user that they were removed from a specific group.
const removeUserController = async (request, response) => {
    try {
        let removedUserId = request.params.userId;
        let groupId = request.params.groupId;
        let adminUserId = request.body.adminUserId;

        let removedUserGroup = await chatServices.deactivateActiveUserHasGroups(removedUserId, groupId);
        let removedUserPlan = await contentCycleServices.deactivateActiveUserHasPlan(removedUserId, groupId);
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

//Queries any notifications that have been read by the user
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
    getCurrentUsersGroupsController: getCurrentUsersGroupsController,
    requestJoinGroupController: requestJoinGroupController,
    getCurrentUserNotifications: getCurrentUserNotifications,
    officiallyJoinGroup: officiallyJoinGroup,
    updateNotificationController: updateNotificationController,
    nudgeUserController: nudgeUserController,
    updateGroupController: updateGroupController,
    getGroupController: getGroupController,
    removeUserController: removeUserController,
    readNotificationsController: readNotificationsController
}