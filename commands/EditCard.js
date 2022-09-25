const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const CONSTANTS = require ("../constants/constants.js");
const FindCardByName = require('../utils/FindCardByName.js');
const GetClassString = require("../utils/GetClassString.js");
const ReplaceEmojisFromNameToClass = require("../utils/ClassFromName.js");
const SaveObjToDB = require("../utils/SaveObjToDB.js");
const Discord = require('discord.js');
const LOCALES = require('../constants/locales.js');

function attachIsImage(msgAttach) {
    var url = msgAttach.url;
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
		embed.setTitle(`${LOCALES.EditCard__MessageEmbed__edited_card_with_name[CONSTANTS.LANG]}`);
		embed.setDescription(`**${(cardClassString) ? cardClassString : ReplaceEmojisFromNameToClass(card)} [${card.name}](${card.url})**`);
		embed.setImage(`${card.url}`);
		message.reply(embed);
	});
}

function EditCard (message, args, client) {
    UserCheck(message.author.id);
    if (!message.member.hasPermission('ADMINISTRATOR')) return; //this command can use admin only
	let obj = ReadDBFile();
    //TODO edit card by 1 argument (cardname)
    if (args.length >= 3) { //strong edit
        let [CardName, editCardName, editClassNumber, imgSrc = undefined] = args;
        CardName = CardName.replace(CONSTANTS.SPACE_REGEX, ' '); // "SPACE_SYMBOL" should use as ' ' if you want to add space in cardname
        const OldCard = FindCardByName(message, CardName, true);
        const EditCard = obj.cards.find(card => { if(card.name == OldCard.name) return card});// get reference of object to edit and save to DB after all
        // stage 1 check cardname if exsists
        editCardName = editCardName.replace(CONSTANTS.SPACE_REGEX, ' '); // ";" should use as ' ' if you want to add space in cardname

        // stage 2 check editClassNumber is it int number?
        if (!typeof(parseInt(editClassNumber, 10)) == 'number') {
            message.reply(`${LOCALES.EditCard__MessageEmbed__class_number[CONSTANTS.LANG]}`);
            return;
        }
        // stage 3 check imgSrc
        if (!imgSrc) {
            if (message.attachments.size > 0) {
                    imgSrc = message.attachments.first().url
            } else {
                message.reply(`${LOCALES.EditCard__MessageEmbed__media_not_found[CONSTANTS.LANG]}`);
                return;
            }
        } 
        if (!attachIsImage({url: imgSrc})) {
            message.reply(`${LOCALES.EditCard__MessageEmbed__media_incorrect[CONSTANTS.LANG]}`);
            return;
        }
        // edit card in card pool
        EditCard.name = editCardName;
        EditCard.class = editClassNumber;
        EditCard.url = imgSrc;
        for (let usr of obj.users) { //apply edit to all users
            let finded = false;
            for(let usrcard of usr.cards) {
                if (!finded && (usrcard.name == OldCard.name)) {
                    usrcard.name = EditCard.name;
                    usrcard.url = EditCard.url;
                    finded = true;
                }
            }
        }
        SaveObjToDB(obj);
        showNewCard(message, EditCard, obj, client);
    }
}

module.exports = {
    name: `${LOCALES.EditCard__EXPORTS__name[CONSTANTS.LANG]}`,
    usage() { return `${CONSTANTS.PREFIX}${this.name} CardName, editCardName editClassNumber [editImageSourceLink]` },
    desc: `${LOCALES.EditCard__EXPORTS__desc[CONSTANTS.LANG]}`,
    func: EditCard,
    permission: 'ADMINISTRATOR'
};