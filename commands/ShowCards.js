const UserCheck = require("../runtime/UserCheck.js");
const ReadDBFile = require("../runtime/ReadDBFile.js");
const InventoryMessages = [];
const CONSTANTS = require ("../constants/constants.js");

function GetPageString(authorId, index) {
    let userCards = GetUserCards(authorId) ; //message.author.id
    if(userCards.length == 0) return `Пока что у вас нет ни одной выбитой карты в инвентаре.`;
    cardString = `Вот что у вас в инвентаре: \n`;
    let strings = [];
    let pageCount = Math.ceil(userCards.length / CONSTANTS.PAGE_SIZE);
    let start = CONSTANTS.PAGE_SIZE * (index);
    let end = CONSTANTS.PAGE_SIZE * (index + 1);
    let obj = ReadDBFile();

    for(let card of userCards) {
        let cardClassNumber = obj.cards.find(cardDB => {return cardDB.name == card.name}).class; 
        let cardClassString = "";
        if (cardClassNumber <= CONSTANTS.CLASS_SYMBOL_OF_VOID) {
            let fillCount;
            for (fillCount = 0; fillCount < cardClassNumber; fillCount++) {
                cardClassString+= CONSTANTS.CLASS_SYMBOL_FILL;
            }
    
            for (fillCount; fillCount < CONSTANTS.CLASS_SYMBOL_OF_VOID; fillCount++) {
                cardClassString+= CONSTANTS.CLASS_SYMBOL_OF_VOID;
            }
        }

        strings.push(`${cardClassString} **${card.name}**  X${card.count}  <${card.url}> \n`);
    }

    let lastPage = "Вот что у вас в инвентаре: \n" ;
    strings.slice(start, end).forEach(card => {lastPage+=card});

    lastPage+=`** страница ${index + 1 } из ${pageCount}**`;
    return lastPage;
}

function getUserFromMention(mention) {
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return;
    return matches[1]; // user id
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
    let messageState =  InventoryMessages.find((m) => {return (m.message.id == message.id) })
    if(!messageState ) return;
    let pageIndex = messageState.index + pageDirrection;
    let lastPage = GetPageString(messageState.authorMessage.author.id, pageIndex);
    messageState.index = pageIndex;
    message.edit(lastPage);
    let pageCount = Math.ceil(GetUserCards(messageState.authorMessage.author.id).length / CONSTANTS.PAGE_SIZE);
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
        member = getUserFromMention(args[0]);
        if (!member) { message.channel.send(error('Для просмотра инвентаря учатника необходимо упомянуть только его')); }
    } else {
        member = message.author.id;
    }
    if (!UserCheck(member)) {
        message.reply(`${(member == message.author) ? "вас" : "пользователя"} еще нет в системе, попробуйте использовать другую команду`);
        return;
    }

    let userCards = GetUserCards(member) ; //message.author.id
    if(userCards.length == 0) {
        message.reply(`Пока что ${ (args[0])?"у участника":"у вас"} нет ни одной выбитой карты в инвентаре.`);
        return;
    }

    cardString = `Вот что ${ (args[0]) ? "у " + args[0] : "у вас"} в инвентаре: \n`;
    let pageCount = Math.floor(userCards.length / CONSTANTS.PAGE_SIZE);
    let pageIndex = pageCount;
    let lastPage = GetPageString(member, pageIndex);

    message.reply(lastPage).then( mes => {
        InventoryMessages.push({message: mes, index: pageIndex, authorMessage: message});
        mes.react('⬅️');
        AwaitReactions(mes, message, pageIndex, pageCount);
    })
}

module.exports = {
    name: 'pokajimne',
    usage() { return `${process.env.PREFIX}${this.name}`; },
    desc: 'Показывает карты, которые у вас в инвентаре',
    func: ShowCard,
};