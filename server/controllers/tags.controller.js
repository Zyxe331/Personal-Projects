const tagServices = require('../services/tags.service.js');
const utils = require('../utils/general_utils');

const getAllTags = async (request, response) => {

    try {

        let tags = await tagServices.queryAllTags();

        // Send success message
        return response.status(200).send(tags);
    } catch (error) {
        return response.status(500).send('Something went wrong internally');
    }

}

const addTag = async (request, response) => {
    tagServices.addTag(request.body.name).then(res => {
        response.status(200).send(res)
    }, err => {
        response.status(500).send(err.message)
    })
}

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