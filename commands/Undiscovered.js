const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const CONSTANTS = require ("../constants/constants.js");
const LOCALES = require('../constants/locales.js');

const NoOneElseHas = (message, args, client) => {
    UserCheck(message.author.id);
    let obj = ReadDBFile();
    let undiscoveredCounter = 0;
    if (!obj.cards.length) {
        message.reply(`${LOCALES.Undiscovered__MessageEmbed__no_cards_in_base[CONSTANTS.LANG]}`);
        return;
    } 
    if (!obj.users.length) {
        message.reply(`${LOCALES.Undiscovered__MessageEmbed__no_users[CONSTANTS.LANG]}`);
        return;
    }

    for (let card of obj.cards) {
        
        let finded = false;
        let usr = obj.users.find( user => {  return  user.cards.find( c =>  { return c.name == card.name } )  });
        
        (!!usr) ? finded = true : undiscoveredCounter++
    }
    message.reply(`${LOCALES.Undiscovered__MessageEmbed__cards_untouched[CONSTANTS.LANG]}**${undiscoveredCounter}** `)
}

module.exports = {
    name: `${LOCALES.Undiscovered__EXPORTS__name[CONSTANTS.LANG]}`,
    usage() { return `${CONSTANTS.PREFIX}${this.name}`; },
    desc: `${LOCALES.Undiscovered__EXPORTS__desc[CONSTANTS.LANG]}`,
    func: NoOneElseHas,
};