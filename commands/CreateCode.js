const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const CONSTANTS = require ("../constants/constants.js");
const SaveObjToDB = require('../utils/SaveObjToDB.js');
const Discord = require('discord.js');
const { v4: uuidv4, v4 } = require('uuid');
const LOCALES = require("../constants/locales.js");


function showCreatedCode(message, code, client) {
	client.users.fetch(message.author.id).then(user => {
		let embed = new Discord.MessageEmbed();
		embed.setColor("#d1b91f");
		embed.setAuthor(user.username, user.displayAvatarURL(), user.url);
		embed.setTitle(`${LOCALES.CreateCode__MessageEmbed__created_code_with_name[CONSTANTS.LANG]}${code.code} `);
		embed.setDescription(`
        ${LOCALES.CreateCode__MessageEmbed__able_to_use_it[CONSTANTS.LANG]}${(code.usingCount) ? `**${code.usingCount}**` : `${LOCALES.CreateCode__MessageEmbed__unlimited_quantity[CONSTANTS.LANG]}`} ${LOCALES.CreateCode__MessageEmbed__users[CONSTANTS.LANG]} 
        ${LOCALES.CreateCode__MessageEmbed__code_expiration_date[CONSTANTS.LANG]}${(code.expDate) ? code.expDate : LOCALES.CreateCode__MessageEmbed__just_unlimited[CONSTANTS.LANG] }
        
        `);
		embed.setImage(`https://c.tenor.com/YdLPqVX9RVoAAAAi/klee-genshin.gif`); //pls change that gif to something normal
		message.reply(embed);
	});
}

function CreateNewCode (message, args, client) {
    UserCheck(message.author.id);
    if (!message.member.hasPermission('ADMINISTRATOR')) return; //this command can use admin only
    let defaultCode = {
        "code": uuidv4(),
        "createdBy": message.author.username,
        "timeStamp": new Date(),
        "usingCount": 1,
        "expDate": null,
        "active": true, 
        "usedBy": [], //{user, date}
    }
    let obj = ReadDBFile();
    if (!obj.codes) obj.codes = []; 
    // lets pars specific parameters
    if (args.length != 0) {
        let usingCount = args.find(elem => {return `${elem}`.startsWith('-u')});
        let expDate = args.find(elem => {return `${elem}`.startsWith('-d')});
        let code = args.find(elem => {return `${elem}`.startsWith('-c')});

        // Check usingCount
        if (usingCount) {
            usingCount = usingCount.replace("-u", '');
            if (usingCount.matchAll('^\d+$')) {
                defaultCode.usingCount = parseInt(usingCount, 10);
            }
        }

        // Check usingCount
        if (expDate) {
            expDate = expDate.replace("-d", '');
            if (usingCount.matchAll('/^\d{2}[./-]\d{2}[./-]\d{4}$/')) {
                defaultCode.expDate = new Date(expDate);
            }
        }

        if (code) {
            code = code.replace("-c", '');
            defaultCode.code = code;
        }
    }

    obj.codes.push(defaultCode);
    SaveObjToDB(obj);
    showCreatedCode(message, defaultCode, client);
    

}

module.exports = {
    name: `${LOCALES.CreateCode__EXPORTS__name[CONSTANTS.LANG]}`,
    usage() { return `${CONSTANTS.PREFIX}${this.name} -c[CodeName] -d[exp-date] -u[usingCount]` },
    desc: `${LOCALES.CreateCode__EXPORTS__desc[CONSTANTS.LANG]}`,
    func: CreateNewCode,
    permission: 'ADMINISTRATOR'
};