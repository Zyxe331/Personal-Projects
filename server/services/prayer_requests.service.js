const Database = require('../utils/database');
const utils = require('../utils/general_utils');

const queryAllPrayerSchedules = async () => {
    let schedules;
    try {
        const db = new Database();
        schedules = await db.query(`SELECT * FROM Prayer_Schedule`);
        db.close();
        console.log(schedules);
    } catch (error) {
        console.error(schedules);
    }
    return schedules;
}

const insertPrayer = async (title, body, isprivate, userid, frequency, NotificationDate, NotificationTime, sectionid) => {
    let now = utils.toMysqlFormat(new Date());
    title = title.replace('\'', '\'\'');
    body = body.replace('\'', '\'\'');
    sectionid = sectionid == undefined ? null : sectionid;
    if (!frequency) {
        frequency = null;
    }

    const db = new Database();
    let result = await db.query(`INSERT INTO PrayerRequest (Title, Body, IsPrivate, Resolved, CreatedDate, User_Id, Frequency, NotificationDate, NotificationTime, Section_Id ) VALUES ('${title}', '${body}', ${isprivate}, false, '${now}', ${userid}, ${frequency}, '${NotificationDate}', '${NotificationTime}', ${sectionid})`).catch(error => {
        console.error(error);
        throw error;
    });

    let rows = await db.query(`SELECT * FROM PrayerRequest WHERE Id = ${result.insertId}`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return rows[0];
}

const queryUserPrayers = async (userid) => {

    const db = new Database();
    let prayers = await db.query(`SELECT pr.Id, pr.Title, pr.Body, pr.CreatedDate, pr.IsPrivate, pr.Resolved, pr.User_Id, pr.Frequency, pr.NotificationDate, pr.NotificationTime FROM PrayerRequest pr WHERE pr.User_Id = ${userid} ORDER BY pr.CreatedDate DESC`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();
    
    return prayers;
}

const querySectionsPrayers = async (userid, sectionIds) => {

    const db = new Database();
    let prayers = await db.query(`SELECT * FROM PrayerRequest WHERE User_Id = ${userid} AND Section_Id IN (${sectionIds}) ORDER BY CreatedDate DESC`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return prayers;

}

const updatePrayer = async (prayerid, title, body, isprivate, prayerscheduleid, NotificationDate, NotificationTime) => {
    title = title.replace('\'', '\'\'');
    body = body.replace('\'', '\'\'');

    let journal;
    try {
        const db = new Database();
        let result = await db.query(`UPDATE PrayerRequest SET Title = '${title}', Body = '${body}', IsPrivate = ${isprivate}, Frequency = ${prayerscheduleid}, NotificationDate = '${NotificationDate}', NotificationTime = '${NotificationTime}' WHERE Id = ${prayerid}`);
        let rows = await db.query(`SELECT pr.Id, pr.Title, pr.Body, pr.CreatedDate, pr.IsPrivate, pr.Resolved, pr.User_Id, pr.Frequency, pr.NotificationDate, pr.NotificationTime FROM PrayerRequest pr WHERE pr.Id = ${prayerid} ORDER BY pr.CreatedDate DESC`);
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

module.exports = {
    queryAllPrayerSchedules: queryAllPrayerSchedules,
    insertPrayer: insertPrayer,
    queryUserPrayers: queryUserPrayers,
    updatePrayer: updatePrayer,
    querySectionsPrayers: querySectionsPrayers
}