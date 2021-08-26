const express = require('express');
const chatController = require('../controllers/chats.controller.js');
const utils = require('../utils/general_utils.js');

const router = express.Router();

router.get('/:userid', utils.simpleAuthCheck, chatController.getCurrentUserGroupInformation);
router.get('/usersgroupInfo/:userid/:groupId', utils.simpleAuthCheck, chatController.getCurrentUserGroupInformation);
router.get('/userGroups/:userid', utils.simpleAuthCheck, chatController.getCurrentUsersGroupsController)
router.get('/notifications/:userid', utils.simpleAuthCheck, chatController.getCurrentUserNotifications);
router.get('/groups/:userId', utils.simpleAuthCheck, chatController.getGroupController);
router.post('/joinGroup/:groupNumber', utils.simpleAuthCheck, chatController.requestJoinGroupController);
router.post('/manageGroup/:groupNumber', utils.simpleAuthCheck, chatController.officiallyJoinGroup);
router.post('/notifications/:notificationId', utils.simpleAuthCheck, chatController.updateNotificationController);
router.post('/notifications', utils.simpleAuthCheck, chatController.readNotificationsController);
router.post('/nudge/:userToNudgeId', utils.simpleAuthCheck, chatController.nudgeUserController);
router.patch('/groups/:groupId', utils.simpleAuthCheck, chatController.updateGroupController);
router.patch('/groups/:groupId/removeUser/:userId', utils.simpleAuthCheck, chatController.removeUserController);


module.exports = router;