const Database = require('../utils/database');
const utils = require('../utils/general_utils.js');
const jsStringEscape = require('js-string-escape');
const deactivateActiveUserHasGroups = async (userid) => {
    const db = new Database();
    await db.query(`UPDATE User_has_Group SET Active = 0 WHERE Active = 1 AND User_Id = ${userid}`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();
}

const createGroup = async (planName, planid) => {
    let now = utils.toMysqlFormat(new Date());

    const db = new Database();
    let result = await db.query(`INSERT INTO \`Group\` (Name, CreatedDate, Active, Plan_Id) VALUES ('${planName} Group','${now}', 1, ${planid})`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return result.insertId;
}

const createUserHasGroup = async (userid, groupid, userHasPlanId, groupRoleId) => {

    const db = new Database();
    let result = await db.query(`INSERT INTO User_has_Group (User_Id, Group_Id, GroupRole_Id, User_has_Plan_Id, Active) VALUES (${userid}, ${groupid}, ${groupRoleId}, ${userHasPlanId}, 1)`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return result.insertId;
}

const getCurrentUserHasGroup = async (userid) => {
    const db = new Database();
    let userHasGroup = await db.query(`SELECT * FROM User_has_Group WHERE User_Id = ${userid} AND Active = 1`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return userHasGroup[0];
}

const getCurrentGroup = async (groupid) => {
    const db = new Database();
    let group = await db.query(`SELECT * FROM \`Group\` WHERE Id = ${groupid}`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return group[0];
}

const getUserGroups = async (groupid, currentuserid) => {
    const db = new Database();
    let userHasGroups = await db.query(`SELECT User_has_Plan_Id, User_Id FROM User_has_Group WHERE User_Id != ${currentuserid} AND Group_Id = ${groupid} AND Active = 1`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return userHasGroups;
}

const getUsers = async (userIds) => {
    const db = new Database();
    let users = await db.query(`SELECT * FROM User WHERE Id IN (${userIds})`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return users;
}

const getUserPlans = async (userPlanIds) => {
    const db = new Database();
    let userHasPlans = await db.query(`SELECT * FROM User_has_Plan WHERE Id IN (${userPlanIds})`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return userHasPlans;
}

const createNotification = async (title, body, fromuserid, touserid, notificationtypeid, groupid) => {
    let now = utils.toMysqlFormat(new Date());

    const db = new Database();
    let result = await db.query(`INSERT INTO Notification (Title, Body, \`Read\`, CreatedDate, To_User_Id, From_User_Id, Notification_Type_Id, Group_Id) VALUES ("${title}", "${body}", 0, '${now}', ${touserid}, ${fromuserid}, ${notificationtypeid}, ${groupid})`).catch(error => {
        console.error(error);
        throw error;
    });

    db.close();

    return result.insertId;
}

const queryUserNotifications = async (userid) => {

    const db = new Database();
    let notifications = await db.query(
        `SELECT n.Id, n.Title, n.Body, n.Read, n.CreatedDate, n.To_User_Id, n.From_User_Id, nt.Name Notification_Type_Name, nt.Ion_Icon Notification_Type_Icon, n.Completed, n.Group_Id FROM \`Notification\` n 
        INNER JOIN Notification_Type nt ON nt.Id = n.Notification_Type_Id
        WHERE To_User_Id = ${userid}
        ORDER BY n.CreatedDate DESC`
    ).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return notifications;
}

const updateNotification = async (notificationId, read, completed) => {

    try {
        const db = new Database();
        let result = await db.query(`UPDATE \`Notification\` SET Completed = ${completed}, \`Read\` = ${read} WHERE Id = ${notificationId}`);
        db.close();

    } catch (error) {
        console.error(error);
    }

}

const updateNotifications = async (notificationIds, read) => {

    let result;
    try {
        const db = new Database();
        result = await db.query(`UPDATE \`Notification\` SET \`Read\` = ${read} WHERE Id IN (${notificationIds})`);
        db.close();

    } catch (error) {
        console.error(error);
    }

    return result;

}

const updateGroup = async (groupId, name) => {
    let group;
    try {
        const db = new Database();
        let result = await db.query(`UPDATE \`Group\` SET Name = '${name}' WHERE Id = ${groupId}`);
        let rows = await db.query(`SELECT * FROM \`Group\` WHERE Id = ${groupId}`);
        db.close();
        if (rows.length === 1) {
            group = rows[0];
        }

    } catch (error) {
        console.error(error);
    }

    return group;
}

module.exports = {
    deactivateActiveUserHasGroups: deactivateActiveUserHasGroups,
    createGroup: createGroup,
    createUserHasGroup: createUserHasGroup,
    getCurrentUserHasGroup: getCurrentUserHasGroup,
    getCurrentGroup: getCurrentGroup,
    getUserGroups: getUserGroups,
    createNotification: createNotification,
    queryUserNotifications: queryUserNotifications,
    updateNotification: updateNotification,
    getUsers: getUsers,
    getUserPlans: getUserPlans,
    updateGroup: updateGroup,
    updateNotifications: updateNotifications
}