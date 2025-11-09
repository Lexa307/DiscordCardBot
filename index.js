const { Client, EmbedBuilder, PermissionsBitField  } = require('discord.js');
const fs = require('fs');
const client = new Client({intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildMessageReactions']});
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
            const helpEmbed = new EmbedBuilder()
                .setTitle(`${LOCALES.Help__MessageEmbed_commands[CONSTANTS.LANG]}`)
                .setColor('#84cc64');
            for (let i = 0; i < BOT_COMMANDS.length; i++) {
                if ( (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !BOT_COMMANDS[i].permission) || message.member.permissions.has(PermissionsBitField.Flags.Administrator) )
                    helpEmbed.addFields({name: BOT_COMMANDS[i].usage(), value: BOT_COMMANDS[i].desc, inline: false});
            } 
            message.channel.send({embeds: [helpEmbed]});
        },
    },
);

client.on('clientReady', () => {
	console.log('Ready');
    console.log(client.generateInvite({scopes: ['bot']}))
});

client.on('guildMemberAdd', member => {
	UserCheck(member.user.id);
});

fs.readdir(`${__dirname}/commands`, (err, file) => {
    for (let i = 0; i < file.length; i++) {
        BOT_COMMANDS.push(require(`./commands/${file[i]}`));
    }
});

client.on('messageCreate', message => {
    if (! message.content.startsWith(CONSTANTS.PREFIX)) return ;
	const args = message.content.slice(CONSTANTS.PREFIX.length).split(/ +/g);
	const command = args.shift().toLowerCase();
	const cmd = BOT_COMMANDS.find( botcommand => botcommand.name == command );
    console.log(cmd);
	if (cmd) cmd.func(message, args, client);
});
client.login(CONSTANTS.TOKEN);