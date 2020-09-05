const express = require('express');
const utils = require('../utils/general_utils.js');
const prayerRequestController = require('../controllers/prayer_requests.controller.js');

const router = express.Router();

// Handles getting all prayer request schedules
router.get('/schedules', utils.simpleAuthCheck, prayerRequestController.getAllPrayerSchedules);

// Handles getting all prayers for the current user
router.get('/:userid', utils.simpleAuthCheck, prayerRequestController.getAllPrayersForUserController);

// Handles inserting a new prayer request
router.post('/', utils.simpleAuthCheck, prayerRequestController.createPrayerController);

// Handles updating a prayer request
router.patch('/:prayerid', utils.simpleAuthCheck, prayerRequestController.updatePrayerController)

module.exports = router;