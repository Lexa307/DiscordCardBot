let fs = require('fs');

module.exports = function ReadDBFile() {
    let obj;
    try {
        let f = fs.readFileSync('./storage/db.json', 'utf8');
        obj = JSON.parse(f);
    } catch (e) {
        return undefined;
    }
    return obj
};