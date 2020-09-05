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

const checkPassword = async (inputPassword, hasedPassword) => {
    return await bcrypt.compare(inputPassword, hasedPassword);
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
            `SELECT u.Id Id, u.FirstName FirstName, u.LastName LastName FROM User_has_Group uhg
            INNER JOIN GroupRole gr ON gr.Id = uhg.GroupRole_Id
            INNER JOIN User u ON u.Id = uhg.User_Id 
            WHERE uhg.Group_Id = ${groupNumber} AND gr.Name = 'Admin'`
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
    findAdminUserForGroup: findAdminUserForGroup
}