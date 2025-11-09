const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const CONSTANTS = require ("../constants/constants.js");
const FindCardByName = require("../utils/FindCardByName.js");
const GetClassString = require("../utils/GetClassString.js");
const GetUserFromMention = require("../utils/GetUserFromMention.js");
const ReplaceEmojisFromNameToClass = require("../utils/ClassFromName.js");
const SaveObjToDB = require("../utils/SaveObjToDB.js");
const {EmbedBuilder, PermissionsBitField} = require('discord.js');
const LOCALES = require("../constants/locales.js");

function isUrlMp4(url) {
    return url.indexOf("mp4", url.length - 3) !== -1;
}

async function showGivenCard(message, card, obj, client, member, addCardCount = 1) {
	let cardClassNumber = obj.cards.find(cardDB => {return cardDB.name == card.name}).class; 
	let cardClassString = GetClassString(cardClassNumber);
    let memberName;
    await client.users.fetch(member).then(user => {
        memberName = user.username;
    })
	client.users.fetch(message.author.id).then(user => {
		let embed = new EmbedBuilder();
		embed.setColor("#d1b91f");
		embed.setAuthor({name: user.username, iconURL: user.displayAvatarURL(), url: user.url});
		embed.setTitle(`${LOCALES.GiveCard__MessageEmbed__issued_a_card[CONSTANTS.LANG]} ${memberName} :`); //Вами была выдана карта пользователю @username 
		embed.setDescription(`**${(cardClassString) ? cardClassString : ReplaceEmojisFromNameToClass(card)} [${card.name}](${card.url})**`);
		embed.setImage(`${card.url}`);
        embed.setFooter({text: `${LOCALES.DropCard__MessageEmbed__cards_you_have_now[CONSTANTS.LANG]} ${addCardCount}`}); //в количестве
		message.reply(embed);
	});
}

function RoleTeter (message, args, client) {
    UserCheck(message.author.id);
    if (!message.guild) return; //if message is not DM
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return; //this command can use admin only
    let member;
    if (args[0]) {
        member = GetUserFromMention(args[0]);
        if (!member) {
            message.reply(`${LOCALES.GiveCard__MessageEmbed__wrong_user[CONSTANTS.LANG]}`); // Для выдачи карты учатнику необходимо упомянуть только его
            return;
        }

    } else {
        member = message.author.id; //error message
    }
    UserCheck(member);

    if (args[1]) {
        const card = FindCardByName(message, args[1]);
        if (card) {
            const obj = ReadDBFile();
            let user = obj.users.find((usr) => {if(usr.id == member) return usr})
            const userCard = user.cards.find(item => { if(item.name == card.name) return item})
            let customAddNumber = parseInt(args[2], 10);
            let addCardCount = customAddNumber ? customAddNumber : 1;
            if (userCard) {
                userCard.count += 1;
            } else {
                user.cards.push(
                    {
                        "name": card.name,
                        "count": (userCard) ? userCard.count + addCardCount : addCardCount,
                        "url": card.url
                    }
                )
            }
            SaveObjToDB(obj);
            showGivenCard(message, card, obj, client, member, addCardCount);
            if (isUrlMp4(card.url)) {
                message.reply(card.url);
            }
        } else {
            return;
        }
    } else {
        //error message
    }
}

module.exports = {
	name: `${LOCALES.GiveCard__EXPORTS__name[CONSTANTS.LANG]}`, // выдайкарту
	usage() { return `${CONSTANTS.PREFIX}${this.name} @UserMention @Cardname cardCount`; },
	desc: `${LOCALES.GiveCard__EXPORTS__desc[CONSTANTS.LANG]}`,
	func: RoleTeter,
    permission: 'ADMINISTRATOR'
};