/**
 * content_cycles.controller.js
 * 
 * The content cycles controller encompasses the JavaScript logic that controls any functionality with content cycles.
 * 
 */

const contentCycleServices = require('../services/content_cycles.service.js');
const chatServices = require('../services/chats.service');
const journalServices = require('../services/journals.service');
const prayerServices = require('../services/prayer_requests.service');
const tagServices = require('../services/tags.service');
const utils = require('../utils/general_utils');

//Assigns variables to a series of queries that flows through the process of subcribing to a plan.
const subscribeToPlan = async (request, response) => {
    //Assigns the variable plan to the plan that is being subcribed to.
    const plan = request.body.plan;
    console.log(plan);
    //Assigns the variable userid to the current user
    const userid = request.body.userId;

    try {
        //Assigns firstSection to a query that retrieves the first section of the plan the user subscribed to.
        let firstSection = await contentCycleServices.getFirstSectionOfPlan(plan.Id);
        console.log(firstSection);
        //Assigns userHasPlan to a query that creates the plan the user is subcribing to.
        let userHasPlan = await contentCycleServices.createUserHasPlan(userid, plan.Id, firstSection.Id);
        console.log(userHasPlan)
        //Assigns groupId to a query that creates a creates a group according to the Title and Id of the user's plan
        let groupId = await chatServices.createGroup(plan.Title, plan.Id);
        //Assigns userHasGroupId to a query that inserts a record into the User_Has_Group table according to the userID, groupID and userHasPlanID.
        let userHasGroupId = await chatServices.createUserHasGroup(userid, groupId, userHasPlan.Id, 1);

        return response.status(200).send(userHasPlan);

    } catch (error) {
        return response.status(500).send('Something went wrong internally');
    }
}

//Queries all of the available plans that a user can subcribe to.
const getAllPlans = async (request, response) => {

    try {

        let plans = await contentCycleServices.queryAllPlans();

        // Send success message
        return response.status(200).send(plans);
    } catch (error) {
        return response.status(500).send('Something went wrong internally');
    }

}

//Assigns variables to queries that gathers the information for a user's plan
const getCurrentUserPlanInformation = async (request, response) => {

    try {

        let userid = request.params.userid;

        let responseBody = {
            currentPlan: null,
            allSections: null,
            currentUserHasPlan: null,
            sectionJournalsBySection: null,
            sectionPrayersBySection: null,
            errorMessage: ''
        }

        let userHasPlan = await contentCycleServices.getCurrentUserHasPlan(userid);
        responseBody.currentUserHasPlan = userHasPlan;

        if (!userHasPlan || userHasPlan === undefined) {
            responseBody.errorMessage = 'User not connected to a plan';
            return response.status(200).send(responseBody);
        }

        let plan = await contentCycleServices.getCurrentPlan(userHasPlan.Plan_Id);
        responseBody.currentPlan = plan;

        if (!plan || plan === undefined) {
            responseBody.errorMessage = 'Plan missing'
            return response.status(204).send(responseBody);
        }

        let sections = await contentCycleServices.getPlansSections(userHasPlan.Plan_Id);
        responseBody.allSections = sections;

        if (!sections || sections === undefined) {
            responseBody.errorMessage = 'Error finding sections'
            return response.status(204).send(responseBody);
        }

        let sectionIds = Array.from(sections, item => item.Id);
        const groupById = utils.groupBy('Section_Id');

        let sectionTags = await tagServices.querySectionsTags(sectionIds);
        let sectionTagsBySection = groupById(sectionTags);

        let sectionJournals = await journalServices.querySectionsJournals(userid, sectionIds); 

        if (!sectionJournals || sectionJournals === undefined) {
            responseBody.errorMessage = 'Error finding journals for sections'
            return response.status(204).send(responseBody);
        }

        let sectionPrayers = await prayerServices.querySectionsPrayers(userid, sectionIds);

        if (!sectionPrayers || sectionPrayers === undefined) {
            responseBody.errorMessage = 'Error finding prayers for sections'
            return response.status(204).send(responseBody);
        }

        let sectionJournalsBySection = groupById(sectionJournals);
        responseBody.sectionJournalsBySection = sectionJournalsBySection;

        let sectionPrayersBySection = groupById(sectionPrayers);
        responseBody.sectionPrayersBySection = sectionPrayersBySection;

        // Send success message
        return response.status(200).send(responseBody);
    } catch (error) {
        console.log(error);
        return response.status(500).send('Something went wrong internally');
    }

}

const updateUserHasPlanController = async (request, response) => {
    try {

        let userPlanId = request.params.userPlanId;
        let sectionId = request.body.sectionId;
        let timesCompleted = request.body.timesCompleted;

        await contentCycleServices.updateUserHasPlan(userPlanId, sectionId, timesCompleted);

        // Send success message
        return response.status(200).send(true)
    } catch (error) {
        return response.status(500).send('Something went wrong internally');
    }
}

module.exports = {
    subscribeToPlan: subscribeToPlan,
    getAllPlans: getAllPlans,
    getCurrentUserPlanInformation: getCurrentUserPlanInformation,
    updateUserHasPlanController: updateUserHasPlanController
}