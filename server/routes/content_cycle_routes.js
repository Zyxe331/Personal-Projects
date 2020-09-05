const express = require('express');
const utils = require('../utils/general_utils.js');
const contentCycleController = require('../controllers/content_cycles.controller.js');

const router = express.Router();

router.get('/', utils.simpleAuthCheck, contentCycleController.getAllPlans);
router.post('/subscribe', utils.simpleAuthCheck, contentCycleController.subscribeToPlan)
router.get('/:userid', utils.simpleAuthCheck, contentCycleController.getCurrentUserPlanInformation);
router.patch('/user-has-plan/:userPlanId', utils.simpleAuthCheck, contentCycleController.updateUserHasPlanController);

module.exports = router;