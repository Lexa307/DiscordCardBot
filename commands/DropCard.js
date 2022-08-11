const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const CONSTANTS = require ("../constants/constants.js");
const SaveObjToDB = require("../utils/SaveObjToDB.js");
const Discord = require('discord.js');
const GetClassString = require("../utils/GetClassString.js");
const ReplaceEmojisFromNameToClass = require("../utils/ClassFromName.js");
const configLocalTime = CONSTANTS.RESET_LOCAL_TIME;
const ReturnRequeredUTCDateToReset = require("../utils/TimeDiff.js");
const LOCALES = require("../constants/locales.js");

function daysDiff(dt1, dt2) { // returns diff between dates in days
	dt2 = new Date(dt2);
	let diffTime = (dt2.getTime() - dt1.getTime());
	let daysDiff = diffTime / (1000 * 3600 * 24); 
	return daysDiff;
}

function showGivenCard(message, card, reRoll = undefined, obj, userData, client) {
	let cardClassNumber = obj.cards.find(cardDB => { return cardDB.name == card.name}).class; 
	let cardClassString = GetClassString(cardClassNumber);
	let sameCardCount = userData.cards.find(item => { if (item.name == card.name) return item }).count;
	client.users.fetch(message.author.id).then(user => {
		let embed = new Discord.MessageEmbed();
		embed.setColor("#d1b91f");
		embed.setAuthor(user.username, user.displayAvatarURL(), user.url);
		embed.setTitle(LOCALES.DropCard__MessageEmbed__got_card_with_name[CONSTANTS.LANG]); // Вам выпала карта с названием:
		embed.setDescription(`**${(cardClassString) ? cardClassString : ReplaceEmojisFromNameToClass(card)} [${card.name}](${card.url})**`);
		embed.setImage(`${card.url}`);
		embed.setFooter(`${LOCALES.DropCard__MessageEmbed__cards_you_have_now[CONSTANTS.LANG]} ${sameCardCount}`); // Таких карт у вас сейчас: X

		if (reRoll) embed.addField(`${LOCALES.DropCard__MessageEmbed__3_cards_in_a_row1[CONSTANTS.LANG]} `, `${LOCALES.DropCard__MessageEmbed__3_cards_in_a_row2[CONSTANTS.LANG]}`);
		message.reply(embed);
	})
}

const DropCard = (message, args, client) => {
	UserCheck(message.author.id);
	let obj = ReadDBFile();
	if (!obj) return;

	for (let i of obj.users ) {
		let finded = true;
		if(i.id == message.author.id) {
				let activeCards = obj.cards.filter((card) => { if (card.active) return card});
				if(activeCards.length == 0) return;
				let rCard = activeCards[ Math.floor(Math.random() * activeCards.length )]; 
				// if(i.lastDropDate == null) {
				let userCard = i.cards.find((item) => { if (item.name == rCard.name) return item})

				let update = false;
				if(i.lastDropDate == null) {
					i.lastDropDate = new Date();
					update = true;
				} else {
					if(!(configLocalTime[0]) && daysDiff(new Date(), i.lastDropDate ) <= -1) {
						i.lastDropDate = new Date();
						update = true;
					} else {
						let lastDropDate = new Date(i.lastDropDate);
						lastDropDate.setDate(lastDropDate.getDate() + 1);
						let remainingTime =  (!(configLocalTime[0]) ? lastDropDate : ReturnRequeredUTCDateToReset()) - Date.now();
						let remainingHours = Math.floor(remainingTime / 3600000);
						remainingTime -= remainingHours * 3600000;
						let remainingMinutes = Math.floor(remainingTime / 60000);
						remainingTime -= remainingMinutes * 60000;
						let remainingSecs = Math.floor(remainingTime / 1000);
						message.reply(`${LOCALES.DropCard__MessageEmbed__cant_get_more_now[CONSTANTS.LANG]} ${remainingHours}${LOCALES.DropCard__MessageEmbed__hours[CONSTANTS.LANG]} ${remainingMinutes }${LOCALES.DropCard__MessageEmbed__min[CONSTANTS.LANG]} ${remainingSecs }${LOCALES.DropCard__MessageEmbed__sec[CONSTANTS.LANG]}`);
					}
				}
				if (update) {
					if (userCard) {
						userCard.count += 1;
					} else {
						i.cards.push(
							{
								"name": rCard.name,
								"count": (userCard) ? userCard.count + 1 : 1,
								"url": rCard.url
							}
						)
					}
					let reRollFlag = undefined;

					if (userCard && userCard.count % 3 == 0) {
						i.lastDropDate = null;
						reRollFlag = true;
					}

					// i.lastDropDate = new Date();
					SaveObjToDB(obj);
					showGivenCard(message, rCard, reRollFlag, obj, i, client);
				}
				return;
		}
		if (!finded) RegisterUser(user.id);
	}
};

module.exports = {
	name: LOCALES.DropCard__EXPORTS__name[CONSTANTS.LANG], // дайкарту
	usage() { return `${CONSTANTS.PREFIX}${this.name}`; },
	desc: LOCALES.DropCard__EXPORTS__desc[CONSTANTS.LANG], // Раз в 24 часа рандомная карта помещается вам в инвентарь при использовании этой команды
	func: DropCard,
};
