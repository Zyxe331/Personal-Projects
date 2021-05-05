const contentCycleServices = require('../services/content_cycles.service.js');
const chatServices = require('../services/chats.service');
const journalServices = require('../services/journals.service');
const prayerServices = require('../services/prayer_requests.service');
const tagServices = require('../services/tags.service');
const utils = require('../utils/general_utils');
const chatsService = require('../services/chats.service');

const subscribeToPlan = async (request, response) => {
    const plan = request.body.plan;
    console.log(plan);
    const userid = request.body.userId;

    try {

        let firstSection = await contentCycleServices.getFirstSectionOfPlan(plan.Id);
        console.log(firstSection);

        let userHasPlan = await contentCycleServices.createUserHasPlan(userid, plan.Id, firstSection.Id);
        console.log(userHasPlan)

        let groupId = await chatServices.createGroup(plan.Title, plan.Id);

        let userHasGroupId = await chatServices.createUserHasGroup(userid, groupId, userHasPlan.Id, 1);

        return response.status(200).send(userHasPlan);

    } catch (error) {
        return response.status(500).send('Something went wrong internally');
    }
}

const getAllPlans = async (request, response) => {

    try {

        let plans = await contentCycleServices.queryAllPlans();

        // Send success message
        return response.status(200).send(plans);
    } catch (error) {
        return response.status(500).send('Something went wrong internally');
    }

}

const getUsersPlansController = async (req, res) => {
    const userId = req.params.userid
    let userHasPlans
    let userHasGroups
    let plans = []
    try {
        userHasPlans = await contentCycleServices.getUsersPlans(userId)
    } catch (err) {
        res.status(500).send(`There was an error retriving the users plans: ${err.message}`)
    }
    try {
        userHasGroups = await chatsService.getUsersGroups(userId)
    } catch (err) {
        res.status(500).send(`There was an error retriving the users groups: ${err.message}`)
    }
    try {
        for (let plan of userHasPlans) {
            let foundPlan = await contentCycleServices.getCurrentPlan(plan.Plan_Id)
            let planSections = (await contentCycleServices.getPlansSections(plan.Plan_Id)).sort((a, b) => a.ContentCycle_Id - b.ContentCycle_Id)
            let planSectionsByCycle = []
            for (let section of planSections) {
                let pushed = false
                if(planSectionsByCycle.length == 0) {
                    planSectionsByCycle.push([section])
                    pushed = true
                }
                else {
                    for(let i = 0; i < planSectionsByCycle.length; i++) {
                        if (section.ContentCycle_Number == planSectionsByCycle[i][0].ContentCycle_Number) {
                            pushed = true
                            planSectionsByCycle[i].push(section)
                        }
                    }
                    if(!pushed) {
                        planSectionsByCycle.push([section])
                    }
                }
            }
            for(let cycle of planSectionsByCycle) {
                cycle.sort((a, b) => a.Order - b.Order)
            }
            let groupId = userHasGroups.find(hasGroup => hasGroup.User_has_Plan_Id == plan.Id).Id
            console.log(`groupID: ${groupId}`)
            plans.push({
                Id: plan.Plan_Id,
                GroupId: groupId,
                Title: foundPlan.Title,
                CreatedDate: foundPlan.CreatedDate,
                sections: planSectionsByCycle
            })
        }
        res.status(200).send(plans)
    } catch (err) {
        res.status(500).send(`There was an error retriving information for plans: ${err.message}`)
    }
}

const getUsersPlansInfoController = async (req, res) => {
    const userId = req.params.userid
    try {
        let userHasPlans = await contentCycleServices.getUsersPlans(userId)
        res.status(200).send(userHasPlans)
    }
    catch(err) {
        res.status(500).send(`There was an error retriving information for plans: ${err.message}`)
    }
}

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
    getUsersPlansController: getUsersPlansController,
    getUsersPlansInfoController: getUsersPlansInfoController,
    getCurrentUserPlanInformation: getCurrentUserPlanInformation,
    updateUserHasPlanController: updateUserHasPlanController
}