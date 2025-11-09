const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const InventoryMessages = [];
const CONSTANTS = require ("../constants/constants.js");
const {EmbedBuilder} = require('discord.js');
const ReplaceEmojisFromNameToClass = require("../utils/ClassFromName.js");
const GetClassString = require("../utils/GetClassString.js");
const GetUserFromMention = require("../utils/GetUserFromMention.js");
const LOCALES = require('../constants/locales.js');

function GetPageString(authorId, index, memberIsAuthor) {
    let userCards = GetUserCards(authorId) ; //message.author.id
    if(userCards.length == 0) return `${LOCALES.ShowCards__MessageEmbed__no_cards[CONSTANTS.LANG]}`;
    cardString = `**${LOCALES.ShowCards__MessageEmbed__cards_in_inventary1[CONSTANTS.LANG]}${(!memberIsAuthor) ? '<@!'+authorId+ '>' : `${LOCALES.ShowCards__MessageEmbed__cards_in_inventary2[CONSTANTS.LANG]}` } ${LOCALES.ShowCards__MessageEmbed__cards_in_inventary3[CONSTANTS.LANG]}**`;
    let strings = [];
    let pageCount = Math.ceil(userCards.length / CONSTANTS.PAGE_SIZE);
    let start = CONSTANTS.PAGE_SIZE * (index);
    let end = CONSTANTS.PAGE_SIZE * (index + 1);
    let obj = ReadDBFile();
    let embed = new EmbedBuilder();
    
    embed.setColor("#0f3961");
    embed.addFields({name: `** **`, value: cardString});
    for(let card of userCards) {
        let cardClassNumber = obj.cards.find(cardDB => {return cardDB.name == card.name}).class; 
        let cardClassString = GetClassString(cardClassNumber);
        strings.push({'cardClassString': cardClassString, name: card.name, count: card.count, url: card.url});
    }
    strings.slice(start, end).forEach(card => {
        embed.addFields(
            {
                name: `--------------------------------------`, 
                value: `${(card.cardClassString) ? card.cardClassString : ReplaceEmojisFromNameToClass(card) }[${card.name}](${card.url}) X${card.count}`
            }
        )
    });
    embed.addFields({name: `** ${LOCALES.ShowCards__MessageEmbed__page[CONSTANTS.LANG]} ${index + 1 } / ${pageCount}**`, value: `** **`})
    return embed;
}

function AwaitReactions(message, authorMessage, pageIndex, pageCount) { // message - that message what contains a user inventory
    const filter = (reaction, user) => {
        return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === authorMessage.author.id;
    };
    message.awaitReactions({filter, max: 1, time: CONSTANTS.INVENTORY_TIME, errors: ['time'] })
    .then(collected => {
        const reaction = collected.first();
        if (reaction.emoji.name === '⬅️') {
            reaction.users.remove(authorMessage.author.id);
            if((pageIndex - 1) <= 0) reaction.remove();
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
        authorMessage.reply(`${LOCALES.ShowCards__MessageEmbed__inventory_is_over[CONSTANTS.LANG]}`);
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
    lastPage.setAuthor({name: embedAuthor.username, iconURL: embedAuthor.displayAvatarURL(), url: embedAuthor.url});
    messageState.index = pageIndex;
    message.edit({embeds: [lastPage]});
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
    UserCheck(message.author.id);
    let member;
    if (args[0]) {
        member = GetUserFromMention(args[0]);
        if (!member) {message.reply(`${LOCALES.ShowCards__MessageEmbed__incorrect_user[CONSTANTS.LANG]}`); return;}
        if (!CONSTANTS.INVENTORY_PUBLIC_ACCESS &&  member != message.author.id ){message.reply(`${LOCALES.ShowCards__MessageEmbed__access_denied[CONSTANTS.LANG]}`); return;}
    } else {
        member = message.author.id;
    }
    let authorIsMember = member == message.author.id;
    UserCheck(member);
    // if (!UserCheck(member)) {
    //     message.reply(`${(authorIsMember) ? "вас" : "пользователя"} еще нет в системе, попробуйте использовать другую команду`);
    //     return;
    // }

    let userCards = GetUserCards(member) ; //message.author.id
    if(userCards.length == 0) {
        message.reply(`${ (args[0])?`${LOCALES.ShowCards__MessageEmbed__no_cards2[CONSTANTS.LANG]}`:`${LOCALES.ShowCards__MessageEmbed__no_cards3[CONSTANTS.LANG]}`} ${LOCALES.ShowCards__MessageEmbed__no_cards4[CONSTANTS.LANG]}`);
        return;
    }

    let pageCount = Math.floor(userCards.length / CONSTANTS.PAGE_SIZE);
    let pageIndex = pageCount;
    let lastPage = GetPageString(member, pageIndex, authorIsMember);
    lastPage.setAuthor({name: message.author.username, iconURL: message.author.displayAvatarURL(), url: message.author.url})
    
    message.reply({embeds: [lastPage]}).then( mes => {
        InventoryMessages.push({message: mes, index: pageIndex, authorMessage: message, inventoryMember: member});
        mes.react('⬅️');
        AwaitReactions(mes, message, pageIndex, pageCount);
    })
}

module.exports = {
    name: `${LOCALES.ShowCards__EXPORTS__name[CONSTANTS.LANG]}`,
    usage() { return `${CONSTANTS.PREFIX}${this.name} || ${CONSTANTS.PREFIX}${this.name} @UserMention `; },
    desc: `${LOCALES.ShowCards__EXPORTS__desc[CONSTANTS.LANG]}`,
    func: ShowCard,
};