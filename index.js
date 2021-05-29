const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const client = new Discord.Client({fetchAllMembers: true});
const prefix = process.env.PREFIX;
const UserCheck = require("./runtime/UserCheck.js")

const BotCommands = [];
let f = fs.readFileSync('./storage/db.json', 'utf8');

BotCommands.push(
    {
      name: 'помощь',
      usage() { return `${process.env.PREFIX}${this.name}`; },
      desc: 'Показывает какие команды имеются у бота',
      func(message) {
        const helpEmbed = new Discord.MessageEmbed()
          .setTitle('Команды бота')
          .setColor('#84cc64');
        for (let i = 0; i < BotCommands.length; i++) helpEmbed.addField(BotCommands[i].usage(), BotCommands[i].desc, false);
        message.channel.send(helpEmbed);
      },
    },
);



client.on('ready', () => {
    console.log('Ready');
    client.generateInvite().then((i) => console.log(i));
});

client.on('guildMemberAdd', member => {
  UserCheck(member.user);
});


fs.readdir(`${__dirname}/commands`, (err, file) => {
    for (let i = 0; i < file.length; i++) {
      BotCommands.push(require(`./commands/${file[i]}`));
    }
});

// 847070015378817024

client.on('message', (message) => {
const args = message.content.slice(prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();
const cmd = BotCommands.find((botcommand) => (botcommand.name === command));
if (cmd) cmd.func(message, args, client);
});
client.login(process.env.TOKEN);

