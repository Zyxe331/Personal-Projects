const adminbroServices = require('../services/adminbro.service.js');

const getImportInfo = async (request, response) => {
    try {
        let file = request.params.file;
        let tableName = request.params.tableName;

        let importCSV = await adminbroServices.importCSV(file, tableName);
        console.log("Controller");

        return response.status(200).send({});
    } catch (error) {
        return response.status(406).send('Import was not successful due to improper file input');
    }
}

module.exports = {
    getImportInfo: getImportInfo
}