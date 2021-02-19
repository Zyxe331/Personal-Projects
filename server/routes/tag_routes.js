const express = require('express');
const tagController = require('../controllers/tags.controller.js');
const utils = require('../utils/general_utils.js');

const router = express.Router();

router.get('/', utils.simpleAuthCheck, tagController.getAllTags);

router.post('/', utils.simpleAuthCheck, tagController.addTag)

router.get('/:prayerid', utils.simpleAuthCheck, tagController.getPrayerTags);

//router.get('/tagbyids', utils.simpleAuthCheck, tagController.getTagById);

module.exports = router;