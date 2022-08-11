const CONSTANTS = require('../constants/constants.js');
const ReadDBFile = require("./ReadDBFile.js");
const fs = require('fs');
let dailyInterval;

function ReturnRequeredUTCDateToReset () {
    const configLocalTime = CONSTANTS.RESET_LOCAL_TIME;
    let localDate = new Date();
    localDate.setHours(parseInt(configLocalTime[0]), parseInt(configLocalTime[1]), parseInt(configLocalTime[2]|0), 0);
    if (new Date() > localDate) localDate.setDate(localDate.getDate() + 1);
    return localDate; 
}

function ResetByInterval() {
    clearInterval(dailyInterval);
    let obj = ReadDBFile();
    for (let i of obj.users ) {
        i.lastDropDate = null;
    }
    let json = JSON.stringify(obj, null, "\t");
    fs.writeFileSync('./storage/db.json', json, 'utf8');
    dailyInterval = setInterval( () => {ResetByInterval()}, ReturnRequeredUTCDateToReset() - new Date());
}

if (CONSTANTS.RESET_LOCAL_TIME[0]) {
    dailyInterval = setInterval( () => {ResetByInterval()}, ReturnRequeredUTCDateToReset() - new Date());
}

module.exports = ReturnRequeredUTCDateToReset