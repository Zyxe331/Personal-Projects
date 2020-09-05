const Database = require('../utils/database');
const utils = require('../utils/general_utils.js');

const insertJournal = async (title, body, userid, sectionid) => {
    let now = utils.toMysqlFormat(new Date());
    title = title.replace('\'', '\'\'');
    body = body.replace('\'', '\'\'');
    sectionid = sectionid == undefined ? null : sectionid;

    const db = new Database();
    let result = await db.query(`INSERT INTO Journal (Title, Body, CreatedDate, User_Id, Section_Id) VALUES ('${title}', '${body}', '${now}', ${userid}, ${sectionid})`).catch(error => {
        console.error(error);
        throw error;
    });
    let rows = await db.query(`SELECT * FROM Journal WHERE Id = ${result.insertId}`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return rows[0];
}

const queryUserJournals = async (userid) => {

    const db = new Database();
    let journals = await db.query(`SELECT * FROM Journal WHERE User_Id = ${userid} ORDER BY CreatedDate DESC`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return journals;
}

const updateJournal = async (journalid, title, body) => {
    title = title.replace('\'', '\'\'');
    body = body.replace('\'', '\'\'');

    let journal;
    try {
        const db = new Database();
        let result = await db.query(`UPDATE Journal SET Title = '${title}', Body = '${body}' WHERE Id = ${journalid}`);
        let rows = await db.query(`SELECT * FROM Journal WHERE Id = ${journalid}`);
        db.close();
        if (rows.length === 1) {
            journal = rows[0];
        }
        console.log(journal);
    } catch (error) {
        console.error(error);
    }
    return journal;
}

const querySectionsJournals = async (userid, sectionIds) => {
    console.log(sectionIds);
    const db = new Database();
    let journals = await db.query(`SELECT * FROM Journal WHERE User_Id = ${userid} AND Section_Id IN (${sectionIds}) ORDER BY CreatedDate DESC`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return journals;
}

module.exports = {
    insertJournal: insertJournal,
    queryUserJournals: queryUserJournals,
    updateJournal: updateJournal,
    querySectionsJournals: querySectionsJournals
}