const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mysql = require('mysql');

// Set up environment file
dotenv.config();

/**
 * Checks the token in the header, if it succeeds then
 * go to the correct url, if it fails return 401
 *
 * @param {*} request
 * @param {*} response
 * @param {*} next
 * @returns
 */
const simpleAuthCheck = (request, response, next) => {

    // Get token from header and see if it exists
    let token = request.headers.authorization;
    if (token === null || token === undefined) {
        response.status(401).send('Unauthorized');
        return;
    }

    try {
        console.log(token);
        // Verify the jwt and if it succeeds go to the correct url
        let jwtResponse = jwt.verify(token, process.env.SECRET_KEY);
        console.log('Successful auth verification');
        next();

    } catch (error) {

        console.log(error);
        // If verify fails return unauthorized
        response.status(401).send(error.name);
        
    }
}

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}


const toMysqlFormat = (givenDate) => {
    return givenDate.getUTCFullYear() + "-" + twoDigits(1 + givenDate.getUTCMonth()) + "-" + twoDigits(givenDate.getUTCDate()) + " " + twoDigits(givenDate.getUTCHours()) + ":" + twoDigits(givenDate.getUTCMinutes()) + ":" + twoDigits(givenDate.getUTCSeconds());
};

const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

module.exports = {
    simpleAuthCheck: simpleAuthCheck,
    toMysqlFormat: toMysqlFormat,
    groupBy: groupBy
}