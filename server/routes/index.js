// Requirements
const express = require('express');
const userRoutes = require('./user_routes.js');
const contentCycleRoutes = require('./content_cycle_routes.js');
const prayerRequestRoutes = require('./prayer_request_routes.js');
const tagRoutes = require('./tag_routes.js');
const journalRoutes = require('./journal_routes.js');
const chatRoutes = require('./chat_routes.js');
const adminbroRoutes = require('./adminbro_routes.js');

// All route definitions
const router = express.Router();
router.use('/users', userRoutes);
router.use('/content-cycles', contentCycleRoutes);
router.use('/prayer-requests', prayerRequestRoutes);
router.use('/tags', tagRoutes);
router.use('/journals', journalRoutes);
router.use('/chats', chatRoutes);
router.use('/import', adminbroRoutes);

module.exports = router;