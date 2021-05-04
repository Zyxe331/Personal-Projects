const express = require('express');
const adminbroController = require('../controllers/adminbro.controller.js');
const utils = require('../utils/general_utils.js');

const router = express.Router();

router.post('/:tableName', utils.simpleAuthCheck, adminbroController.getImportInfo);

module.exports = router;