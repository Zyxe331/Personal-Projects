const express = require('express');
const utils = require('../utils/general_utils.js');
const contentCycleController = require('../controllers/content_cycles.controller.js');

const router = express.Router();

//Handles getting all the available content cycles
router.get('/', utils.simpleAuthCheck, contentCycleController.getAllPlans);

// Handles subcribing the user to a new content cyles
router.post('/subscribe', utils.simpleAuthCheck, contentCycleController.subscribeToPlan)

// Handles getting all of the content cycle information for the current user
router.get('/:userid', utils.simpleAuthCheck, contentCycleController.getCurrentUserPlanInformation);

// Handles updating a content cyle for the current user
router.patch('/user-has-plan/:userPlanId', utils.simpleAuthCheck, contentCycleController.updateUserHasPlanController);

module.exports = router;