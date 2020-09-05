const express = require('express');
const utils = require('../utils/general_utils.js');
const journalController = require('../controllers/journals.controller.js');

const router = express.Router();

// Handles creating a new journal
router.post('/', utils.simpleAuthCheck, journalController.createJournalController);

// Handles getting all journals for the current user
router.get('/:userid', utils.simpleAuthCheck, journalController.getAllJournalsForUserController);

// Handles updating a journal
router.patch('/:journalid', utils.simpleAuthCheck, journalController.updateJournalController);

module.exports = router;