const Database = require('../utils/database');
const utils = require('../utils/general_utils');

const queryAllTags = async () => {

    const db = new Database();
    let tags = await db.query(`SELECT * FROM Tag WHERE Active = 1 ORDER BY Name ASC`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return tags;

}

const addTag = async (name) => {
    const db = new Database()
    let newTag = await db.query(`INSERT INTO Tag(Name, Active) VALUES ('${name}', 1)`).catch(err => {
        console.error(err)
        throw err
    })
    db.close()
    console.log(newTag)
    return {
        Id: newTag.insertId,
        Name: name,
        Active: true
    }
}

const querySectionsTags = async (sectionIds) => {

    const db = new Database();
    let tags = await db.query(`SELECT * FROM Section_has_Tag WHERE Section_Id IN (${sectionIds})`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return tags;

}

const queryPrayersTags = async (prayerId) => {

    const db = new Database();
    let tags = await db.query(`SELECT pht.Id, pht.Tag_Id, pht.PrayerRequest_Id, t.Name Tag_Name FROM Prayer_has_Tag pht INNER JOIN Tag t ON pht.Tag_Id = t.Id WHERE PrayerRequest_Id = ${prayerId}`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return tags;

}

const queryTagById = async (tagIds) => {
    
    const db = new Database();
    let tags = await db.query(`SELECT * FROM Tag WHERE Id IN (${tagIds})`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return tags;

}

const insertPrayerTags = async (prayerId, tagids) => {
    
    const db = new Database();
    let q = `INSERT INTO Prayer_has_Tag (Tag_Id, PrayerRequest_Id) VALUES `;
    for (let i = 0; i < tagids.length; i++) {
        q += `('${tagids[i]}', '${prayerId}')`;
        if (i < tagids.length - 1) {
            q += ',';
        }
    }
    q += ';';
    
    let result = await db.query(q).catch(error => {
        console.error(error);
        throw error;
    });

    let rows = await db.query(`SELECT * FROM Prayer_has_Tag WHERE Id = ${result.insertId}`).catch(error => {
        console.error(error);
        throw error;
    });
    db.close();

    return rows[0];
}

const updatePrayerTags = async (prayerId, tagids) => {

    try {
        const db = new Database();
        if(prayerId) {
            let result = await db.query(`DELETE FROM Prayer_has_Tag WHERE PrayerRequest_Id = ${prayerId}`);
            db.close();
            if (tagids == null || tagids.length == 0) return;
            insertPrayerTags(prayerId, tagids);
        }
    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    queryAllTags: queryAllTags,
    querySectionsTags: querySectionsTags,
    queryPrayersTags: queryPrayersTags,
    queryTagById: queryTagById,
    insertPrayerTags: insertPrayerTags,
    updatePrayerTags: updatePrayerTags,
    addTag: addTag
}