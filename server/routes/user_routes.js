const express = require('express');
const userController = require('../controllers/users.controller.js');

const router = express.Router();

// Handles loggin in a user
router.post('/login', userController.loginController);

// Handles registering a user
router.post('/register', userController.registerController);

// Handles checking if an access token is valid
router.post('/verifyAuth', userController.verifyAuthController);

// Handles checking if an access token is valid
router.patch('/:userid', userController.updateUserController);

router.get('/:userid/groups', userController.getuserGroups)

module.exports = router;