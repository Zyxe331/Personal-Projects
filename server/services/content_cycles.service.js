const Database = require('../utils/database');
const utils = require('../utils/general_utils.js');

const queryAllPlans = async () => {

    const db = new Database();
    let plans = await db.query(`SELECT * FROM Plan ORDER BY Title DESC`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return plans;

}

const deactivateActiveUserHasPlans = async (userid) => {
    const db = new Database();
    await db.query(`UPDATE User_has_Plan SET Active = 0 WHERE Active = 1 AND User_Id = ${userid}`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();
}

const getFirstSectionOfPlan = async (planid) => {
    const db = new Database();
    let sections = await db.query(`SELECT s.Id FROM Section s INNER JOIN ContentCycle cc ON cc.Id = s.ContentCycle_Id INNER JOIN Plan p ON p.Id = cc.Plan_Id WHERE p.Id = ${planid} AND cc.Cycle_Number = 1 AND s.Order = 1`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return sections[0];
}

const createUserHasPlan = async (userid, planid, firstSectionId) => {
    const db = new Database();
    let result = await db.query(`INSERT INTO User_has_Plan (User_Id, Plan_Id, Current_Section_Id, Active) VALUES (${userid}, ${planid}, ${firstSectionId}, 1)`).catch(error => {
        console.error(error);
        throw error;
    });

    let userHasPlan = await db.query(`SELECT * FROM User_has_Plan WHERE Id = ${result.insertId}`).catch(error => {
        console.error(error);
        throw error;
    });

    db.close();

    return userHasPlan[0];
}

const getCurrentUserHasPlan = async (userid) => {
    const db = new Database();
    let userHasPlan = await db.query(`SELECT * FROM User_has_Plan WHERE User_Id = ${userid} AND Active = 1`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return userHasPlan[0];
}

const getCurrentPlan = async (planid) => {
    const db = new Database();
    let plan = await db.query(`SELECT * FROM Plan WHERE Id = ${planid}`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return plan[0];
}

const getPlansSections = async (planid) => {
    const db = new Database();
    let sections = await db.query(`SELECT s.Id, s.Title, s.Main_Idea, s.Song_Link, s.Passage_Reference,s. Passage_Paraphrased, s.Additional_Thoughts, s.Order, s.ContentCycle_Id, s.CreatedDate, cc.Cycle_Number ContentCycle_Number FROM Section s INNER JOIN ContentCycle cc ON cc.Id = s.ContentCycle_Id WHERE cc.Plan_Id = ${planid} ORDER BY cc.Cycle_Number, s.Order`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return sections;
}

const updateUserHasPlan = async (userplanid, sectionid, timesCompleted) => {

    const db = new Database();
    await db.query(`UPDATE User_has_Plan SET Current_Section_Id = ${sectionid}, Times_Completed = ${timesCompleted} WHERE Id = ${userplanid}`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

}

module.exports = {
    queryAllPlans: queryAllPlans,
    deactivateActiveUserHasPlans: deactivateActiveUserHasPlans,
    getFirstSectionOfPlan: getFirstSectionOfPlan,
    createUserHasPlan: createUserHasPlan,
    getCurrentUserHasPlan: getCurrentUserHasPlan,
    getCurrentPlan: getCurrentPlan,
    getPlansSections: getPlansSections,
    updateUserHasPlan: updateUserHasPlan
}