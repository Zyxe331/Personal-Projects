const Database = require('../utils/database');
const utils = require('../utils/general_utils.js');
const jsStringEscape = require('js-string-escape');
const deactivateActiveUserHasGroups = async (userid, groupId) => {
    const db = new Database();
    let userHasGroup
    try {
        userHasGroup = await db.query(`Select * FROM User_has_Group INNER JOIN User_has_Plan ON User_has_Group.User_has_Plan_Id=User_has_Plan.Id WHERE User_has_Plan.User_Id = ${userid} AND Group_Id=${groupId}`)
        await db.query(`UPDATE User_has_Group INNER JOIN User_has_Plan ON User_has_Group.User_has_Plan_Id=User_has_Plan.Id SET User_has_Group.Active=0 WHERE User_has_Group.Active = 1 AND User_has_Plan.User_Id = ${userid} AND Group_Id=${groupId}`)
    }
    catch (err) {
        console.error(error);
        throw error;
    }
    db.close();
    return userHasGroup
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
    let result = await db.query(`INSERT INTO User_has_Group (Group_Id, GroupRole_Id, User_has_Plan_Id, Active) VALUES (${groupid}, ${groupRoleId}, ${userHasPlanId}, 1)`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return result.insertId;
}

const getCurrentUserHasGroup = async (userid) => {
    const db = new Database();
    console.log(userid);
    let userHasGroup = await db.query(`SELECT User_has_Group.* FROM User_has_Group INNER JOIN User_has_Plan ON User_has_Group.User_has_Plan_Id=User_has_Plan.Id WHERE User_has_Plan.User_Id=${userid} AND User_has_Group.Active=1`).catch(error => {
        console.error(error);
        throw error;
    });
    console.log(userHasGroup[0]);
    db.close();

    return userHasGroup[0];
}

const getCurrentGroup = async (groupid) => {
    const db = new Database();
    let group = await db.query(`SELECT * FROM \`Group\` WHERE Id = ${groupid}`).catch(error => {
    //let group = await db.query(`SELECT User_has_Plan_Id, User_has_Plan.User_Id FROM User_has_Group INNER JOIN User_has_Plan ON User_has_Group.User_has_Plan_Id = User_has_Plan.Id WHERE User_has_Plan.User_Id = ${currentUserId} AND User_has_Group.Active = 1`).catch(error => {   
        console.error(error);
        throw error;
    });
    db.close();

    return group[0];
}

const getUsersGroups = async (currentuserid) => {
    const db = new Database();
    let groups = await db.query(`SELECT group.Id, group.Name, group.CreatedDate as Created_Date, group.Active, User_has_Plan_Id, User_has_Plan.User_Id FROM User_has_Group 
                                INNER JOIN User_has_Plan ON User_has_Group.User_has_Plan_Id = User_has_Plan.Id
                                INNER JOIN \`Group\` ON User_has_Group.Group_Id = Group.Id
                                WHERE User_has_Plan.User_Id = ${currentuserid} AND User_has_Group.Active = 1`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return groups;
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

const getUserGroups = async(userId) => {
    let result;
    try {
        const db = new Database();
        result = await db.query(`SELECT \`Group\`.* FROM \`Group\`, User_has_Plan, User_has_Group WHERE User_has_Plan.User_Id = '${userId}' AND User_has_Plan.Id = User_has_Group.User_has_Plan_Id AND  User_has_Group.Active = 1 AND \`Group\`.Id = User_has_Group.Group_Id;`);
        db.close();
    } catch (error) {
        console.error(error);
    }

    return result;
}

const getUserHasGroupForGivenGroup = async (groupId) => {
    const db = new Database();
    let userHasGroups = await db.query(`SELECT User_has_Group.* FROM User_has_Group INNER JOIN User_has_Plan ON User_has_Group.User_has_Plan_Id=User_has_Plan.Id WHERE User_has_Group.Group_Id = ${groupId} AND User_has_Group.Active=1`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return userHasGroups;
}

const getUsersOfGroup = async (groupId) => {
    const db = new Database();
    let userHasGroups = await db.query(`SELECT user.Id as Id, user.FirstName as FirstName, user.LastName as LastName, user.Username as username, user.email as email FROM user INNER JOIN user_has_plan ON user.Id = user_has_plan.User_Id INNER JOIN user_has_group on user_has_plan.Id = user_has_group.User_has_Plan_Id WHERE User_has_Group.Group_Id = ${groupId} AND User_has_Group.Active=1`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return userHasGroups;
}

module.exports = {
    deactivateActiveUserHasGroups: deactivateActiveUserHasGroups,
    createGroup: createGroup,
    createUserHasGroup: createUserHasGroup,
    getCurrentUserHasGroup: getCurrentUserHasGroup,
    getCurrentGroup: getCurrentGroup,
    getUsersGroups: getUsersGroups,
    getUserGroups: getUserGroups,
    getUserHasGroupForGivenGroup: getUserHasGroupForGivenGroup,
    getUsersOfGroup: getUsersOfGroup,
    createNotification: createNotification,
    queryUserNotifications: queryUserNotifications,
    updateNotification: updateNotification,
    getUsers: getUsers,
    getUserPlans: getUserPlans,
    updateGroup: updateGroup,
    updateNotifications: updateNotifications
}