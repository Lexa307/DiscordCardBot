const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const CONSTANTS = require ("../constants/constants.js");
const FindCardByName = require("../utils/FindCardByName.js");
const GetClassString = require("../utils/GetClassString.js");
const GetUserFromMention = require("../utils/GetUserFromMention.js");
const ReplaceEmojisFromNameToClass = require("../utils/ClassFromName.js");
const SaveObjToDB = require("../utils/SaveObjToDB.js");
const {EmbedBuilder} = require('discord.js');
const LOCALES = require("../constants/locales.js");

function showGivenCard(message, card, obj, client) {
	let cardClassNumber = obj.cards.find(cardDB => {return cardDB.name == card.name}).class; 
	let cardClassString = GetClassString(cardClassNumber);
	client.users.fetch(message.author.id).then(user => {
		let embed = new EmbedBuilder();
		embed.setColor("#d1b91f");
		embed.setAuthor(user.username, user.displayAvatarURL(), user.url);
		embed.setTitle(`${LOCALES.GiveCard__MessageEmbed__issued_a_card[CONSTANTS.LANG]}`); //Вами была выдана карта с названием: 
		embed.setDescription(`**${(cardClassString) ? cardClassString : ReplaceEmojisFromNameToClass(card)} [${card.name}](${card.url})**`);
		embed.setImage(`${card.url}`);
		message.reply(embed);
	});
}

function RoleTeter (message, args, client) {
    UserCheck(message.author.id);
    if (!message.guild) return; //if message is not DM
    if (!message.member.permissions.has('ADMINISTRATOR')) return; //this command can use admin only
    let member;
    if (args[0]) {
        member = GetUserFromMention(args[0]);
        if (!member) message.channel.send(`${LOCALES.GiveCard__MessageEmbed__wrong_user[CONSTANTS.LANG]}`); // Для выдачи карты учатнику необходимо упомянуть только его
    } else {
        member = message.author.id;
    }
    UserCheck(member);

    if (args[1]) {
        const card = FindCardByName(message, args[1]);
        if (card) {
            const obj = ReadDBFile();
            let user = obj.users.find((usr) => {if(usr.id == member) return usr})
            const userCard = user.cards.find(item => { if(item.name == card.name) return item})
            if (userCard) {
                userCard.count += 1;
            } else {
                user.cards.push(
                    {
                        "name": card.name,
                        "count": (userCard) ? userCard.count + 1 : 1,
                        "url": card.url
                    }
                )
            }
            SaveObjToDB(obj);
            showGivenCard(message, card, obj, client);
        } else {
            return;
        }
    }
}

module.exports = {
	name: `${LOCALES.GiveCard__EXPORTS__name[CONSTANTS.LANG]}`, // выдайкарту
	usage() { return `${CONSTANTS.PREFIX}${this.name} @UserMention @Cardname`; },
	desc: `${LOCALES.GiveCard__EXPORTS__desc[CONSTANTS.LANG]}`,
	func: RoleTeter,
    permission: 'ADMINISTRATOR'
};