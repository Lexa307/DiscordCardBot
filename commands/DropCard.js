const UserCheck = require("../runtime/UserCheck.js");
const ReadDBFile = require("../runtime/ReadDBFile.js");
const CONSTANTS = require ("../constants/constants.js");
const fs = require('fs');
const Discord = require('discord.js');
const GetClassString = require("../runtime/GetClassString.js");
const ReplaceEmojisFromNameToClass = require("../runtime/ClassFromName.js");
const configLocalTime = CONSTANTS.RESET_LOCAL_TIME;
const ReturnRequeredUTCDateToReset = require("../runtime/TimeDiff.js");

function daysDiff(dt1, dt2) {
	dt2 = new Date(dt2);
	let diffTime = (dt2.getTime() - dt1.getTime());
	let daysDiff = diffTime / (1000 * 3600 * 24); 
	return daysDiff;
}

function showGivenCard(message, card, reRoll = undefined, obj, client) {
	let cardClassNumber = obj.cards.find(cardDB => {return cardDB.name == card.name}).class; 
	let cardClassString = GetClassString(cardClassNumber);
	client.users.fetch(message.author.id).then(user => {
		let embed = new Discord.MessageEmbed();
		embed.setColor("#d1b91f");
		embed.setAuthor(user.username, user.displayAvatarURL(), user.url);
		embed.setTitle(`Вам выпала карта с названием: `);
		embed.setDescription(`**${(cardClassString) ? cardClassString : ReplaceEmojisFromNameToClass(card)} [${card.name}](${card.url})**`);
		embed.setImage(`${card.url}`);
		embed.setTimestamp(Date.now());

		if (reRoll) embed.addField(`Поздравляю тебе выпало 3 повторки! 👏👏👏 `, `Можешь попытаться выбить еще одну карту прямо сейчас!`);
		message.reply(embed);
	})
}

const DropCard = (message, args, client) => {
	UserCheck(message.author);
	let obj = ReadDBFile();
	if (!obj) return;

	for (let i of obj.users ) {
		let finded = true;
		if(i.id == message.author.id) {
				let activeCards = obj.cards.filter((card) => {if(card.active) return card});
				if(activeCards.length == 0) return;
				let rCard = activeCards[ Math.floor(Math.random() * activeCards.length )]; 
				// if(i.lastDropDate == null) {
				let userCard = i.cards.find((item)=>{ if(item.name == rCard.name) return item})

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
						let remainingHours = Math.floor( remainingTime / 3600000);
						remainingTime -= remainingHours * 3600000;
						let remainingMinutes = Math.floor(remainingTime / 60000);
						remainingTime -= remainingMinutes * 60000;
						let remainingSecs = Math.floor(remainingTime / 1000);
						message.reply(`Сейчас у вас не получится получить карту, но вы можете попытать удачу через: ${remainingHours}ч ${remainingMinutes }м ${remainingSecs }с`);
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
					let json = JSON.stringify(obj, null, "\t");
					fs.writeFileSync('./storage/db.json', json, 'utf8');
					showGivenCard(message, rCard, reRollFlag, obj, client);
				}
				return;
		}
		if (!finded) RegisterUser(user);
	}
};

module.exports = {
	name: 'daikarty',
	usage() { return `${CONSTANTS.PREFIX}${this.name}`; },
	desc: 'Раз в 24 часа рандомная карта помещается вам в инвентарь при использовании этой команды',
	func: DropCard,
};
