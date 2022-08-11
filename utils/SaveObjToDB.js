/*
Saves database object in file systew
*/
const fs = require('fs');
module.exports = function SaveObjToDB(obj) {
    fs.writeFileSync('./storage/db.json', JSON.stringify(obj, null, "\t"), 'utf8');
}