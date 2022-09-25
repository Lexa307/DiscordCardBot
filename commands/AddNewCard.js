/*summary: adds new card to drop pull

    example: !новаякарта Королева;монстров 6 https://media.discordapp.net/attachments/852679774128439386/993195205731819559/117.gif
    ";" - using as " " to avoid errors on spliting args
    also you can skip 4th argument by adding attachment to your message
*/
const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const CONSTANTS = require ("../constants/constants.js");
const FindCardByName = require('../utils/FindCardByName.js');
const GetClassString = require("../utils/GetClassString.js");
const ReplaceEmojisFromNameToClass = require("../utils/ClassFromName.js");
const SaveObjToDB = require('../utils/SaveObjToDB.js');
const Discord = require('discord.js');
const LOCALES = require('../constants/locales.js');

function attachIsImage(msgAttach) {
    let url = msgAttach.url;
    //True if this url is a png/jpg/gif image.
    return url.indexOf("png", url.length - 3) !== -1 || url.indexOf("jpg", url.length - 3) !== -1 || url.indexOf("gif", url.length - 3) !== -1;
}
function showNewCard(message, card, obj, client) {
	let cardClassNumber = obj.cards.find(cardDB => {return cardDB.name == card.name}).class; 
	let cardClassString = GetClassString(cardClassNumber);
	client.users.fetch(message.author.id).then(user => {
		let embed = new Discord.MessageEmbed();
		embed.setColor("#d1b91f");
		embed.setAuthor(user.username, user.displayAvatarURL(), user.url);
		embed.setTitle(`${LOCALES.AddNewCard__MessageEmbed__added_card_with_name[CONSTANTS.LANG]}`);
		embed.setDescription(`**${(cardClassString) ? cardClassString : ReplaceEmojisFromNameToClass(card)} [${card.name}](${card.url})**`);
		embed.setImage(`${card.url}`);
		message.reply(embed);
	});
}

function AddNewCard (message, args, client) {
    UserCheck(message.author.id);
    if (!message.member.hasPermission('ADMINISTRATOR')) return; //this command can use admin only
	let obj = ReadDBFile();

    if (args.length >= 2) {
        let [newCardName, classNumber, imgSrc = undefined] = args;
        // stage 1 check cardname if exsists
        newCardName = newCardName.replace(CONSTANTS.SPACE_REGEX, ' '); // "SPACE_SYMBOL" should use as ' ' if you want to add space in cardname
        if (FindCardByName(message, newCardName, true) != 0) {
            message.reply(`${LOCALES.AddNewCard__MessageEmbed__name_already_exists[CONSTANTS.LANG]}`);
            return;
        }
        // stage 2 check classNumber is it int number?
        if (!typeof(parseInt(classNumber, 10)) == 'number') {
            message.reply(`${LOCALES.AddNewCard__MessageEmbed__class_number[CONSTANTS.LANG]}`);
            return;
        }
        // stage 3 check imgSrc
        if (!imgSrc) {
            if (message.attachments.size > 0) {
                    imgSrc = message.attachments.first().url
            } else {
                message.reply(`${LOCALES.AddNewCard__MessageEmbed__media_not_found[CONSTANTS.LANG]}`);
                return;
            }
        } 
        if (!attachIsImage({url: imgSrc})) {
            message.reply(`${LOCALES.AddNewCard__MessageEmbed__media_incorrect[CONSTANTS.LANG]}`);
            return;
        }
        let newCard = 
        {
            "name": newCardName,
            "class": classNumber,
            "active": true,
            "url": imgSrc
        }
        obj.cards.push(newCard) 

        SaveObjToDB(obj);
        showNewCard(message, newCard, obj, client);
    }
}

module.exports = {
    name: `${LOCALES.AddNewCard__EXPORTS__name[CONSTANTS.LANG]}`,
    usage() { return `${CONSTANTS.PREFIX}${this.name} CardName ClassNumber [ImageSourceLink]` },
    desc: `${LOCALES.AddNewCard__EXPORTS__desc[CONSTANTS.LANG]}`,
    func: AddNewCard,
    permission: 'ADMINISTRATOR'
};