const UserCheck = require("../runtime/UserCheck.js");
const ReadDBFile = require("../runtime/ReadDBFile.js");
const InventoryMessages = [];
const CONSTANTS = require ("../constants/constants.js");
const Discord = require('discord.js');
const ReplaceEmojisFromNameToClass = require("../runtime/ClassFromName.js");
const GetClassString = require("../runtime/GetClassString.js");
const GetUserFromMention = require("../runtime/GetUserFromMention.js");

function GetPageString(authorId, index, memberIsAuthor) {
    let userCards = GetUserCards(authorId) ; //message.author.id
    if(userCards.length == 0) return `Пока что у вас нет ни одной выбитой карты в инвентаре.`;
    cardString = `**Вот что у ${(!memberIsAuthor) ? '<@!'+authorId+ '>' : 'вас' } в инвентаре:**`;
    let strings = [];
    let pageCount = Math.ceil(userCards.length / CONSTANTS.PAGE_SIZE);
    let start = CONSTANTS.PAGE_SIZE * (index);
    let end = CONSTANTS.PAGE_SIZE * (index + 1);
    let obj = ReadDBFile();
    let embed = new Discord.MessageEmbed();
    
    embed.setColor("#0f3961");
    embed.addField(`** **`, cardString);
    for(let card of userCards) {
        let cardClassNumber = obj.cards.find(cardDB => {return cardDB.name == card.name}).class; 
        let cardClassString = GetClassString(cardClassNumber);
        strings.push({'cardClassString': cardClassString, name: card.name, count: card.count, url: card.url});
    }
    strings.slice(start, end).forEach(card => {embed.addField(`--------------------------------------`, `${(card.cardClassString) ? card.cardClassString : ReplaceEmojisFromNameToClass(card) }[${card.name}](${card.url}) X${card.count}`)});
    embed.addField(`** страница ${index + 1 } из ${pageCount}**`, `** **`)
    return embed;
}

function AwaitReactions(message, authorMessage, pageIndex, pageCount) { // message - that message what contains a user inventory
    const filter = (reaction, user) => {
        return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === authorMessage.author.id;
    };

    message.awaitReactions(filter, {max: 1, time: CONSTANTS.INVENTORY_TIME })
    .then(collected => {
        const reaction = collected.first();
        if (reaction.emoji.name === '⬅️') {
            reaction.users.remove(authorMessage.author.id);
            if((pageIndex - 1) == 0) reaction.remove();
            ChangeInventoryPage(message, -1);
        } else {
            reaction.users.remove(authorMessage.author.id);
            if((pageIndex + 1) == pageCount - 1) reaction.remove();
            ChangeInventoryPage(message, 1);
        }
    })
    .catch(collected => {
        let arrInventoryMessagesIndex = InventoryMessages.indexOf(InventoryMessages.find( m => {return (m.message.id == message.id) }));
        InventoryMessages.splice(arrInventoryMessagesIndex, 1);
        authorMessage.reply('Время действия инвентаря закончилось');
        message.reactions.removeAll();
    });
}

async function ChangeInventoryPage(message, pageDirrection) {
    let messageState = InventoryMessages.find((m) => {return (m.message.id == message.id) })
    if(!messageState ) return;
    let pageIndex = messageState.index + pageDirrection;
    let authorIsMember = (messageState.authorMessage.author.id == messageState.inventoryMember)
    let lastPage = GetPageString(messageState.inventoryMember, pageIndex, authorIsMember);
    let embedAuthor = messageState.authorMessage.author;
    lastPage.setAuthor(embedAuthor.username, embedAuthor.displayAvatarURL(), embedAuthor.url);
    messageState.index = pageIndex;
    message.edit(lastPage);
    let pageCount = Math.ceil(GetUserCards(messageState.inventoryMember).length / CONSTANTS.PAGE_SIZE);
    if(pageIndex > 0 ) await message.react('⬅️');
    if(pageIndex < pageCount - 1) await message.react('➡️');
    AwaitReactions(message, messageState.authorMessage, pageIndex, pageCount);
}

function GetUserCards(userId) {
    let obj = ReadDBFile();
    return obj.users.find((user) => {if(userId == user.id) return user.cards}).cards;
}


const ShowCard = async (message, args, client) => {
    UserCheck(message.author);
    let member;
    if (args[0]) {
        member = GetUserFromMention(args[0]);
        if (!member) {message.reply('Для просмотра инвентаря учатника необходимо упомянуть только его'); return;}
        if (!CONSTANTS.INVENTORY_PUBLIC_ACCESS &&  member != message.author.id ){message.reply('Вы не можете посмотреть инвентарь участника пока он сам его не откроет при вас'); return;}
    } else {
        member = message.author.id;
    }
    let authorIsMember = member == message.author.id;
    if (!UserCheck(member)) {
        message.reply(`${(authorIsMember) ? "вас" : "пользователя"} еще нет в системе, попробуйте использовать другую команду`);
        return;
    }

    let userCards = GetUserCards(member) ; //message.author.id
    if(userCards.length == 0) {
        message.reply(`Пока что ${ (args[0])?"у участника":"у вас"} нет ни одной выбитой карты в инвентаре.`);
        return;
    }

    let pageCount = Math.floor(userCards.length / CONSTANTS.PAGE_SIZE);
    let pageIndex = pageCount;
    let lastPage = GetPageString(member, pageIndex, authorIsMember);
    lastPage.setAuthor(message.author.username, message.author.displayAvatarURL(), message.author.url)
    
    message.reply(lastPage).then( mes => {
        InventoryMessages.push({message: mes, index: pageIndex, authorMessage: message, inventoryMember: member});
        mes.react('⬅️');
        AwaitReactions(mes, message, pageIndex, pageCount);
    })
}

module.exports = {
    name: 'pokajimne',
    usage() { return `${CONSTANTS.PREFIX}${this.name} || ${CONSTANTS.PREFIX}${this.name} @UserMention `; },
    desc: 'Показывает карты, находящиеся у вас или у @UserMention в инвентаре',
    func: ShowCard,
};