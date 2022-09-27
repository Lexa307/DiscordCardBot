const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const CONSTANTS = require ("../constants/constants.js");
const GetUserFromMention = require("../utils/GetUserFromMention.js");
const SaveObjToDB = require("../utils/SaveObjToDB.js");
const {EmbedBuilder} = require('discord.js');
const LOCALES = require('../constants/locales.js');

function ResetDrop (message, args, client) {
    UserCheck(message.author.id);
    if (!message.guild) return; //if message is not DM
    if (!message.member.permissions.has('ADMINISTRATOR')) return; //this command can use admin only
    let member, messageEnding;
    if (args[0]) {
        member = GetUserFromMention(args[0]);
        if (!member) {
            message.channel.send(`${LOCALES.ResetDrop__MessageEmbed__specify_user[CONSTANTS.LANG]}`); 
            return;
        }
        client.users.fetch(member).then(user => {
            messageEnding = user.username;
        });
    } else {
        member = null;
        messageEnding = `${LOCALES.ResetDrop__MessageEmbed__to_all_users[CONSTANTS.LANG]}`;
    }
    UserCheck(member);
    const memeGifs = [ // TODO: comment this at master
        "https://c.tenor.com/hJR5o7BTK7MAAAAC/serial-experiments-lain-lain.gif",
        "https://c.tenor.com/PaeXns-85fQAAAAC/scp.gif",
        "https://c.tenor.com/33anXDfc5mUAAAAd/coconut-nekopara.gif",
        "https://c.tenor.com/7-gvhGIXMNkAAAAd/metal-gear-rising-jetstream-sam.gif",
        "https://c.tenor.com/fws6rIp681UAAAAd/gman-walk.gif",
        "https://c.tenor.com/KHpeP1HyGOYAAAAC/mouse-dance.gif",
        "https://c.tenor.com/HPKNtgcxC0YAAAAd/gachi.gif",
        "https://c.tenor.com/_d9UdsUv8jIAAAAC/congratulations-evangelion.gif",
        "https://c.tenor.com/-7iAbYi5EdIAAAAd/memes-meme.gif",
        "https://c.tenor.com/Zd4fex5jsoYAAAAC/american-psycho-patrick-bateman.gif",
        "https://c.tenor.com/CO2IhmW-do8AAAAd/yandere-dev-milk.gif"
    ]

    const obj = ReadDBFile();
     
    if (!member) {
        for (let user of obj.users) {
            user.lastDropDate = null;
        }
    } else {
        let user = obj.users.find((usr) => {if (usr.id == member) return usr})
        user.lastDropDate = null;
    }
    SaveObjToDB(obj);
    client.users.fetch(message.author.id).then(user => {
		let embed = new EmbedBuilder();
		embed.setColor("#d1b91f");
		embed.setAuthor({name: user.username, iconURL: user.displayAvatarURL(), url: user.url});
		embed.setTitle(`${LOCALES.ResetDrop__MessageEmbed__updated_drops[CONSTANTS.LANG]}${messageEnding}`);
        embed.setImage(memeGifs[Math.floor(Math.random() * memeGifs.length)]); // So i decided to add some funny/congrats gifs that will be shown in chat, be free to add something special for your users or to disable it just // this string
		message.reply({embeds: [embed]});
	})
}

module.exports = {
	name: `${LOCALES.ResetDrop__EXPORTS__name[CONSTANTS.LANG]}`,
	usage() { return `${CONSTANTS.PREFIX}${this.name} [@UserMention]`; },
	desc: `${LOCALES.ResetDrop__EXPORTS__desc[CONSTANTS.LANG]}`,
	func: ResetDrop,
    permission: 'ADMINISTRATOR'
};