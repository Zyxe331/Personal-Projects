/**
 * journals.controller.js
 * 
 * The journals controller encompasses the JavaScript logic that controls the journals page.
 * 
 */

const journalServices = require('../services/journals.service.js');

const createJournalController = async (request, response) => {

    try {
        //Request information for a journal and use said information for a query that inserts information into a new journal.
        const title = request.body.title;
        const body = request.body.body;
        const userid = request.body.userId;
        const sectionid = request.body.sectionId;

        let journal = await journalServices.insertJournal(title, body, userid, sectionid);

        // Check if journal inserted
        if (!journal || journal.Id === undefined) {
            return response.status(404).send('Journal failed to insert');
        }

        // Send success message
        return response.status(200).send(journal);
    } catch (error) {
        return response.status(500).send('Something went wrong internally: ' + error.error);
    }
}

const getAllJournalsForUserController = async (request, response) => {

    try {
        // Get userid and query journals for that user
        let userid = request.params.userid;
        let journals = await journalServices.queryUserJournals(userid);

        // Send success message
        return response.status(200).send(journals);
    } catch (error) {
        return response.status(500).send('Something went wrong internally');
    }

}

const updateJournalController = async (request, response) => {
    try {
        // Get userid and query journals for that user
        let journalid = request.params.journalid;
        let title = request.body.title;
        let body = request.body.body;

        let journal = await journalServices.updateJournal(journalid, title, body);

        if (journal) {

            // Send success message
            return response.status(200).send(journal);
            
        }
    } catch (error) {
        return response.status(500).send('Something went wrong internally')
    }
}

module.exports = {
    createJournalController: createJournalController,
    getAllJournalsForUserController: getAllJournalsForUserController,
    updateJournalController: updateJournalController
}