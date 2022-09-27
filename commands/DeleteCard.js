const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const CONSTANTS = require ("../constants/constants.js");
const FindCardByName = require('../utils/FindCardByName.js');
const GetClassString = require("../utils/GetClassString.js");
const ReplaceEmojisFromNameToClass = require("../utils/ClassFromName.js");
const SaveObjToDB = require("../utils/SaveObjToDB.js");
const {EmbedBuilder} = require('discord.js');
const LOCALES = require('../constants/locales.js');

function showDeletedCard(message, card, obj, client) {
	let cardClassNumber = card.class; 
	let cardClassString = GetClassString(cardClassNumber);
	client.users.fetch(message.author.id).then(user => {
		let embed = new EmbedBuilder();
		embed.setColor("#d1b91f");
		embed.setAuthor({name: user.username, iconURL: user.displayAvatarURL(), url: user.url});
		embed.setTitle(`${LOCALES.DeleteCard__MessageEmbed__deleted_card_with_name[CONSTANTS.LANG]}`);
		embed.setDescription(`**${(cardClassString) ? cardClassString : ReplaceEmojisFromNameToClass(card)} [${card.name}](${card.url})**`);
		embed.setImage(`${card.url}`);
		message.reply({embeds: [embed]});
	});
}

function DeleteCard (message, args, client) {
    UserCheck(message.author.id);
    if (!message.member.permissions.has('ADMINISTRATOR')) return; //this command can use admin only
	let obj = ReadDBFile();
    if (args.length == 1) { //strong delete
        let deleteCardName = args[0];
        deleteCardName = deleteCardName.replace(CONSTANTS.SPACE_REGEX, ' '); // "SPACE_SYMBOL" should use as ' ' if you want to add space in cardname
        if (!FindCardByName(message, deleteCardName, true)) {message.reply(`${LOCALES.DeleteCard__MessageEmbed__card_not_found[CONSTANTS.LANG]}`); return; }
        const DeleteCard = obj.cards.find(card => { if(card.name == deleteCardName) return card});// get reference of object to edit and save to DB after all
        // delete card in card pool
        if (DeleteCard) obj.cards = obj.cards.filter(function(item) { return item !== DeleteCard })

        for (let usr of obj.users) { //delete card from all users
            usr.cards = usr.cards.filter(function(item) { return item.name !== DeleteCard.name })
        }
        SaveObjToDB(obj);
        showDeletedCard(message, DeleteCard, obj, client);
    } else {
        message.reply(`${LOCALES.DeleteCard__MessageEmbed__mandatory_argument[CONSTANTS.LANG]}`);
        return;
    }
}

module.exports = {
    name: `${LOCALES.DeleteCard__EXPORTS__name[CONSTANTS.LANG]}`,
    usage() { return `${CONSTANTS.PREFIX}${this.name} CardName` },
    desc: `${LOCALES.DeleteCard__EXPORTS__desc[CONSTANTS.LANG]}`,
    func: DeleteCard,
    permission: 'ADMINISTRATOR'
};