const Discord = require('discord.js');
const fs = require('fs');
const Client = new Discord.Client({fetchAllMembers: true});
const CONSTANTS = require('./constants/constants.js');
const UserCheck = require("./utils/UserCheck.js");
const LOCALES = require("./constants/locales.js");
const BOT_COMMANDS = [];
BOT_COMMANDS.push(
    {
        name: `${LOCALES.Help__EXPORTS__name[CONSTANTS.LANG]}`,
        usage() { return `${CONSTANTS.PREFIX}${this.name}`; },
        desc: `${LOCALES.Help__EXPORTS__desc[CONSTANTS.LANG]}`,
        func(message) {
            const helpEmbed = new Discord.MessageEmbed()
                .setTitle(`${LOCALES.Help__MessageEmbed_commands[CONSTANTS.LANG]}`)
                .setColor('#84cc64');
            for (let i = 0; i < BOT_COMMANDS.length; i++) {
                if ( (!message.member.hasPermission('ADMINISTRATOR') && !BOT_COMMANDS[i].permission) || message.member.hasPermission('ADMINISTRATOR') )
                    helpEmbed.addField(BOT_COMMANDS[i].usage(), BOT_COMMANDS[i].desc, false);
            } 
            message.channel.send(helpEmbed);
        },
    },
);

Client.on('ready', () => {
	console.log('Ready');
	Client.generateInvite().then((i) => console.log(i));
});

Client.on('guildMemberAdd', member => {
	UserCheck(member.user.id);
});

fs.readdir(`${__dirname}/commands`, (err, file) => {
    for (let i = 0; i < file.length; i++) {
        BOT_COMMANDS.push(require(`./commands/${file[i]}`));
    }
});


Client.on('message', (message) => {
    if (! message.content.startsWith(CONSTANTS.PREFIX)) return ;
	const args = message.content.slice(CONSTANTS.PREFIX.length).split(/ +/g);
	const command = args.shift().toLowerCase();
	const cmd = BOT_COMMANDS.find( botcommand => botcommand.name == command );
	if (cmd) cmd.func(message, args, Client);
});
Client.login(CONSTANTS.TOKEN);