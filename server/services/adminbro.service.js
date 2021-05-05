const Database = require('../utils/database');
const utils = require('../utils/general_utils.js');
const jsStringEscape = require('js-string-escape');

const importCSV = async (file, tableName) => {
    const db = new Database();

    console.log(tableName);
}

module.exports = {
    importCSV: importCSV
}