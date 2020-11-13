const utils = require('../utils/general_utils.js');
const Database = require('../utils/database');
const bcrypt = require('bcryptjs');

const findUserByEmail = async (email) => {

    let user;
    try {
        const db = new Database();
        let rows = await db.query(`SELECT * FROM User WHERE Email = '${email}'`);
        if (rows.length === 1) {
            user = rows[0];
        }
        console.log(user);
    } catch (error) {
        console.error(error);
    }

    return user;
}

const getPasswordFromEmail = async (email) => {

    let userPassword;
    try {
        const db = new Database();
        let rows = await db.query(`SELECT Password FROM User WHERE Email = '${email}'`);
        if (rows.length === 1) {
            userPassword = rows[0].Password;
        }
    } catch (error) {
        console.error(error);
    }

    return userPassword;      
}

const getUserRoleId = async (email) => {
    let userRoleID;
    try {
        const db = new Database();
        let rows = await db.query(`SELECT Role_Id FROM User WHERE Email = '${email}'`);
        if (rows.length === 1) {
            userRoleID = rows[0].Role_Id;
        }
        console.log(userRoleID);
    } catch (error) {
        console.error(error);
    }

    return userRoleID;      
}

const checkPassword = async (inputPassword, hashedPassword) => {
    return await bcrypt.compare(inputPassword, hashedPassword);
}

const findUserById = async (id) => {

    let user;
    try {
        const db = new Database();
        let rows = await db.query(`SELECT * FROM User WHERE Id = ${id}`);
        if (rows.length === 1) {
            user = rows[0];
        }
    } catch (error) {
        console.error(error);
    }

    return user;
}

const findAdminUserForGroup = async (groupNumber) => {
    let user;
    try {
        const db = new Database();
        let rows = await db.query(
            `SELECT User.Id Id, User.FirstName FirstName, User.LastName LastName FROM User_has_Group
            INNER JOIN GroupRole ON GroupRole.Id = User_has_Group.GroupRole_Id
            INNER JOIN User_has_Plan on User_has_Plan.Id = User_has_Group.User_has_Plan_Id
            INNER JOIN User ON User.Id = User_has_Plan.User_Id 
            WHERE User_has_Group.Group_Id = ${groupNumber} AND GroupRole.Name = 'Admin'`
        );
        if (rows.length === 1) {
            user = rows[0];
        }
    } catch (error) {
        console.error(error);
    }

    return user;
}

const createUser = async (email, password, firstName, lastName, phoneNumber) => {
    let user;
    try {

        // Get the current date and hash the password
        let now = utils.toMysqlFormat(new Date());
        let bcryptedPassword = await bcrypt.hash(password, 5);

        // Format given values to work with sql
        firstName = firstName === undefined ? null : `'${firstName}'`;
        lastName = lastName === undefined ? null : `'${lastName}'`;
        phoneNumber = phoneNumber === undefined ? null : `'${phoneNumber}'`;
        email = `'${email}'`;

        // Connect to db
        const db = new Database();

        // Insert user into db
        let result = await db.query(`INSERT INTO User (FirstName, LastName, Email, Active, CreatedDate, PhoneNumber, Role_Id, Password) Values(${firstName}, ${lastName}, ${email}, 1, '${now}', ${phoneNumber}, 2, '${bcryptedPassword}');`);

        // Query user that was just inserted
        let rows = await db.query(`SELECT * FROM User WHERE Id = ${result.insertId}`);
        if (rows.length === 1) {
            user = rows[0];
        }
    } catch (error) {
        console.error(error);
    }

    return user;
}

const updateUser = async (userid, email, firstname, lastname, phone) => {

    let user;
    try {
        const db = new Database();
        let result = await db.query(`UPDATE \`User\` SET Email = '${email}', FirstName = '${firstname}', LastName = '${lastname}', PhoneNumber = '${phone}' WHERE Id = ${userid}`);
        let rows = await db.query(`SELECT * FROM \`User\` WHERE Id = ${userid}`);
        db.close();
        if (rows.length === 1) {
            user = rows[0];
        }
        console.log(user);
    } catch (error) {
        console.error(error);
    }
    return user;
}

module.exports = {
    findUserByEmail: findUserByEmail,
    findUserById: findUserById,
    createUser: createUser,
    checkPassword: checkPassword,
    updateUser: updateUser,
    findAdminUserForGroup: findAdminUserForGroup,
    getPasswordFromEmail: getPasswordFromEmail,
    getUserRoleId: getUserRoleId
}