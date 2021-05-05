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

const insertPrayer = async (title, body, isprivate, resolved, CreatedDate, userid, NotificationDate, NotificationTime, frequency, sectionid) => {
    let now = utils.toMysqlFormat(new Date());
    title = title.replace('\'', '\'\'');
    body = body.replace('\'', '\'\'');
    sectionid = sectionid == undefined ? null : sectionid;
    if (!frequency) {
        frequency = null;
    }

    const db = new Database();
    let result = await db.query(`INSERT INTO PrayerRequest (Title, Body, IsPrivate, Resolved, CreatedDate, User_Id, NotificationDate, NotificationTime, Frequency, Section_Id ) VALUES ('${title}', '${body}', ${isprivate}, false, '${now}', ${userid}, '${NotificationDate}', '${NotificationTime}', ${frequency}, ${sectionid})`).catch(error => {
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
    let prayers = await db.query(`SELECT pr.Id, pr.Title, pr.Body, pr.CreatedDate, pr.IsPrivate, pr.Resolved, pr.User_Id, pr.Frequency, pr.NotificationDate, pr.NotificationTime, pr.Section_Id FROM PrayerRequest pr WHERE pr.User_Id = ${userid} ORDER BY pr.CreatedDate DESC`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();
    
    return prayers;
}

const queryUserScheduledPrayers = async (userid) => { // Returns user prayer requests where Frequency is not NULL (prayer request has a notification)

    const db = new Database();
    let prayers = await db.query(`SELECT pr.Id, pr.Title, pr.Body, pr.CreatedDate, pr.IsPrivate, pr.Resolved, pr.User_Id, pr.Frequency, pr.NotificationDate, pr.NotificationTime, pr.Section_Id, pr.Notification_Id FROM PrayerRequest pr WHERE pr.User_Id = ${userid} AND pr.Frequency IS NOT NULL ORDER BY pr.CreatedDate DESC`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return JSON.parse(JSON.stringify(prayers));
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

const updatePrayer = async (prayerid, title, body, isprivate, prayerscheduleid, NotificationDate, NotificationTime, Notification_Id) => {
    title = title.replace('\'', '\'\'');
    body = body.replace('\'', '\'\'');

    let journal;
    try {
        const db = new Database();
        let result = await db.query(`UPDATE PrayerRequest SET Title = '${title}', Body = '${body}', IsPrivate = ${isprivate}, Frequency = ${prayerscheduleid}, NotificationDate = '${NotificationDate}', NotificationTime = '${NotificationTime}', Notification_Id = '${Notification_Id}' WHERE Id = ${prayerid}`);
        let rows = await db.query(`SELECT pr.Id, pr.Title, pr.Body, pr.CreatedDate, pr.IsPrivate, pr.Resolved, pr.User_Id, pr.Frequency, pr.NotificationDate, pr.NotificationTime, pr.Notification_Id FROM PrayerRequest pr WHERE pr.Id = ${prayerid} ORDER BY pr.CreatedDate DESC`);
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

const getNextTriggerDate = (createdDate, freq) => {
    let originalDate = new Date(createdDate);
    var millisecondsToAdd = 0;
    var nextTrigger = 0;

    if (freq == 4) { // Because the days in a month differ, we cant use the same logic we do for the rest of the repeating notifications
        var date = new Date(createdDate);
        var now = new Date(Date.now());

        while (dateMonth < now) {
        date = new Date(date.setMonth(date.getMonth()+1)); // Add a month to original scheduled date until it is in the future, then return that value as the next trigger date
        }
        nextTrigger = date.getTime();

    }
    else {
        // The 86400000 number is the number of milliseconds in a day.
        if (freq == 2) { millisecondsToAdd = 86400000; }
        if (freq == 3) { millisecondsToAdd = 86400000*7; }
        if (freq == 5) { millisecondsToAdd = 86400000*365; }

        let numberOfMillToAdd = (Date.now() - originalDate)%millisecondsToAdd; //We use this equation and modulus to determine when the notification should be next triggered and return that value
        var milliseconds = (numberOfMillToAdd - 1)*millisecondsToAdd;
        nextTrigger = milliseconds + originalDate.getTime();
    }

    return nextTrigger; // Return nextTrigger date in milliseconds since 1/1/1970
}

module.exports = {
    queryAllPrayerSchedules: queryAllPrayerSchedules,
    insertPrayer: insertPrayer,
    queryUserPrayers: queryUserPrayers,
    updatePrayer: updatePrayer,
    querySectionsPrayers: querySectionsPrayers,
    queryUserScheduledPrayers: queryUserScheduledPrayers,
    getNextTriggerDate: getNextTriggerDate
}