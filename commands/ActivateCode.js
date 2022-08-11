const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const CONSTANTS = require ("../constants/constants.js");
const SaveObjToDB = require('../utils/SaveObjToDB.js');
const LOCALES = require('../constants/locales.js');

function ActivateCode (message, args, client) {
    UserCheck(message.author.id);
    if (args.length == 1) {
        let obj = ReadDBFile();
        // check code if exists
        let userCode = args[0];
        let dbCode = obj.codes.find(elem => {return elem.code === userCode })
        if (dbCode.active) {
            // check date restrictions of code
            if (dbCode.expDate) {
                if ((new Date().getTime() - new Date(dbCode.expDate).getTime() ) > 0) {
                    message.reply(LOCALES.ActivateCode__MessageEmbed__code_expired[CONSTANTS.LANG]);
                    return;
                }
            }
            // check code for avalible usage count
            if (dbCode.usingCount) {
                if (dbCode.usingCount <= dbCode.usedBy.length) {
                    message.reply(LOCALES.ActivateCode__MessageEmbed__exceeded_number_uses[CONSTANTS.LANG]);
                    return;
                }
            }

            // check if user already used this code
            if (dbCode.usedBy.find(elem => { return elem.userId == message.author.id})) {
                message.reply(LOCALES.ActivateCode__MessageEmbed__already_used[CONSTANTS.LANG]);
                return;
            }

            // activate code for user
            dbCode.usedBy.push({
                "userId" : message.author.id,
                "date": new Date()
            })

            let user = obj.users.find((usr) => {if (usr.id == message.author.id) return usr})
            user.lastDropDate = null;
            SaveObjToDB(obj);
            message.reply(`${LOCALES.ActivateCode__MessageEmbed__code[CONSTANTS.LANG]}**${userCode}**${LOCALES.ActivateCode__MessageEmbed__activated[CONSTANTS.LANG]}`);

        }

    }
}

module.exports = {
    name: `${LOCALES.ActivateCode__EXPORTS__name[CONSTANTS.LANG]}`,
    usage() { return `${CONSTANTS.PREFIX}${this.name} Code `; },
    desc: `${LOCALES.ActivateCode__EXPORTS__desc[CONSTANTS.LANG]}`,
    func: ActivateCode,
};