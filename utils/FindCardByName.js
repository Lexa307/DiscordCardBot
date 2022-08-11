const CONSTANTS = require("../constants/constants");
const ReadDBFile = require("./ReadDBFile.js");
const LOCALES = require('../constants/locales.js');
function GetCardObjectByName (message, cardname, strict = false) { 
    // returns a single card object that can be found by a single match of its name in the database
    // if it has greater than 1 matches or zero it will ask user to write exactly name of card that should be find
    const obj = ReadDBFile();
    const matches = [];
    for (let i = 0; i < obj.cards.length; i++) {
        if ( (!strict) ? ~obj.cards[i].name.toLowerCase().indexOf(cardname.toLowerCase()) : obj.cards[i].name.toLowerCase() == cardname.toLowerCase() ) matches.push(obj.cards[i]);
    }
    if (matches.length == 1) return matches[0];
    if (!strict) {
        if (matches.length > 1) message.reply(`${LOCALES.FindCardByName__MessageEmbed_one_more_card_exist[CONSTANTS.LANG]}`);
        if (matches.length == 0) message.reply(`${LOCALES.FindCardByName__MessageEmbed_no_similar_name_found[CONSTANTS.LANG]}`);
    }
    return 0; // returns zero if results of searching was incorrect.
}

module.exports = GetCardObjectByName;