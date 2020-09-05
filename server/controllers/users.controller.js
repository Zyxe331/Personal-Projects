const userServices = require('../services/users.service.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Set up environment file
dotenv.config();

/**
 * Handles trying to login a user given an email and password
 *
 * @param {*} request
 * @param {*} response
 * @returns
 */
const loginController = async (request, response) => {

    // Get information sent from front end
    const email = request.body.email;
    const password = request.body.password;
    let token = request.headers.authorization;

    try {
        let jwtResponse = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
        console.log(error.name);
    }

    let user = await userServices.findUserByEmail(email);

    // Check if a user is found
    if (!user || user.Id === undefined) {
        return response.status(404).send('No user found');
    }

    let correctPassword = await userServices.checkPassword(password, user.Password);

    // Check password
    if (!correctPassword) {
        return response.status(401).send('Invalid password');
    }

    // Create access token and send user with auth token to front end
    const accessToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
    console.log(process.env.ACCESS_TOKEN_EXPIRATION);
    response.status(200).send({ "user": user, "access_token": accessToken, "expires_in": process.env.ACCESS_TOKEN_EXPIRATION });

}

/**
 * Handles registering a new user given an email and a password
 *
 * @param {*} request
 * @param {*} response
 * @returns
 */
const registerController = async (request, response) => {

    console.log(request.body);

    // Get information sent from front end
    const email = request.body.email;
    const password = request.body.password;
    const firstname = request.body.firstname;
    const lastname = request.body.lastname;
    const phone = request.body.phone;

    let user = await userServices.createUser(email, password, firstname, lastname, phone);
    console.log(user);
    // Check if a user is found
    if (!user || user.Id === undefined) {
        return response.status(404).send('Failed to create user');
    }

    // Create access token and send user with auth token to front end
    const accessToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
    response.status(200).send({ "user": user, "access_token": accessToken, "expires_in": process.env.ACCESS_TOKEN_EXPIRATION });

}

/**
 * Handles checking if the token in the header is valid
 *
 * @param {*} request
 * @param {*} response
 * @returns
 */
const verifyAuthController = (request, response) => {

    // Get the token and check if it exists
    let token = request.headers.authorization;
    if (token === null || token === undefined) {
        response.status(401).send('Unauthorized');
        return;
    }

    try {

        // Verify the signed jwt and pass the user back to client if succeeds
        let jwtResponse = jwt.verify(token, process.env.SECRET_KEY);
        let user = userServices.findUserById(jwtResponse.id);
        response.status(200).send(user);

    } catch (error) {

        // Return error if something goes wrong
        response.status(401).send(error.name);
        
    }

}

const updateUserController = async (request, response) => {
    try {

        // Get values to update prayer with
        let userid = request.params.userid;
        let email = request.body.email;
        let firstname = request.body.firstname;
        let lastname = request.body.lastname;
        let phone = request.body.phone;

        let user = await userServices.updateUser(userid, email, firstname, lastname, phone);

        if (user) {

            // Send success message
            return response.status(200).send(user);
            
        }
    } catch (error) {
        return response.status(500).send('Something went wrong internally')
    }
}

module.exports = {
    loginController: loginController,
    verifyAuthController: verifyAuthController,
    registerController: registerController,
    updateUserController: updateUserController
}