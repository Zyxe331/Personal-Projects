const prayerRequestServices = require('../services/prayer_requests.service.js');
const utils = require('../utils/general_utils');
const tagServices = require('../services/tags.service');

const getAllPrayerSchedules = async (request, response) => {
    try {

        let schedules = await prayerRequestServices.queryAllPrayerSchedules();

        // Check if schedules were found
        if (!schedules || schedules.length === 0) {
            return response.status(404).send('Could not find any prayer schedules');
        }

        // Send success message
        return response.status(200).send(schedules);
    } catch (error) {
        return response.status(500).send('Something went wrong internally when querying prayer schedules: ' + error.error);
    }
}

const createPrayerController = async (request, response) => {

    try {
        const title = request.body.title;
        const body = request.body.body;
        const isprivate = request.body.isprivate;
        const userid = request.body.userId;
        const frequency = request.body.frequency;
        const NotificationDate = request.body.NotificationDate;
        const NotificationTime = request.body.NotificationTime;
        const tagids = request.body.tagIds;
        const sectionid = request.body.sectionId;

        console.log(sectionid);

        let prayer = await prayerRequestServices.insertPrayer(title, body, isprivate, userid, frequency, NotificationDate, NotificationTime, sectionid);
        console.log(tagids);
        if (tagids.length != 0) await tagServices.insertPrayerTags(prayer.Id, tagids);

        // Check if journal inserted
        if (!prayer || prayer.Id === undefined) {
            return response.status(404).send('Prayer failed to insert');
        }

        // Send success message
        return response.status(200).send(prayer);
    } catch (error) {
        console.log(error);
        return response.status(500).send('Something went wrong internally: ' + error.error);
    }
}

const getAllPrayersForUserController = async (request, response) => {
    
    try {
        // Get userid and query prayers for that user
        let userid = request.params.userid;
        let prayers = await prayerRequestServices.queryUserPrayers(userid);

        let prayerIds = Array.from(prayers, item => item.Id);
        const groupById = utils.groupBy('Prayer_Id');

        //let prayerTags = await tagServices.queryPrayersTags(prayerIds);

        // Send success message
        return response.status(200).send(prayers);
    } catch (error) {
        return response.status(500).send('Something went wrong internally');
    }

}

const updatePrayerController = async (request, response) => {
    try {

        // Get values to update prayer with
        let prayerid = request.params.prayerid;
        let title = request.body.title;
        let body = request.body.body;
        let isprivate = request.body.isprivate;
        let frequency = request.body.frequency;
        let tagids = [];
        tagids = request.body.tagIds;

        console.log(tagids);
        let prayer = await prayerRequestServices.updatePrayer(prayerid, title, body, isprivate, frequency, NotificationDate, NotificationTime);
        let prayerTags = await tagServices.updatePrayerTags(prayerid, tagids);

        if (prayer) {

            // Send success message
            return response.status(200).send(prayer);
            
        }
    } catch (error) {
        return response.status(500).send('Something went wrong internally')
    }
}

module.exports = {
    getAllPrayerSchedules: getAllPrayerSchedules,
    createPrayerController: createPrayerController,
    getAllPrayersForUserController: getAllPrayersForUserController,
    updatePrayerController: updatePrayerController
}