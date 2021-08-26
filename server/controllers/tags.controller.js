/**
 * tags.controller.js
 * 
 * The tags controller encompasses the JavaScript logic that controls any functionality with tags.
 * 
 */

const tagServices = require('../services/tags.service.js');
const utils = require('../utils/general_utils');

//Queries any active tags within the app
const getAllTags = async (request, response) => {

    try {

        let tags = await tagServices.queryAllTags();

        // Send success message
        return response.status(200).send(tags);
    } catch (error) {
        return response.status(500).send('Something went wrong internally');
    }

}

//Takes the name information of a tag being requested and send a success or error message.
const addTag = async (request, response) => {
    tagServices.addTag(request.body.name).then(res => {
        response.status(200).send(res)
    }, err => {
        response.status(500).send(err.message)
    })
}

//Queries any tags associated by an ID
const getTagById = async (request, response) => {

    try {
        const tagids = request.body.tagIds;
        let tags = await tagServices.queryTagById(tagids);

        // Send success message
        return response.status(200).send(tags);
    } catch (error) {
        return response.status(500).send('Something went wrong internally');
    }

}

//Queries the available tags that are associated with a specific prayer
const getPrayerTags = async (request, response) => {

    try {
        const prayerid = request.params.prayerid;
        let tags = await tagServices.queryPrayersTags(prayerid);

        // Send success message
        return response.status(200).send(tags);
    } catch (error) {
        return response.status(500).send('Something went wrong internally');
    }

}

module.exports = {
    getAllTags: getAllTags,
    getTagById: getTagById,
    getPrayerTags: getPrayerTags,
    addTag: addTag
}