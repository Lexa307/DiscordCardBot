const UserCheck = require("../runtime/UserCheck.js");
const ReadDBFile = require("../runtime/ReadDBFile.js");
const InventoryMessages = [];
const PAGE_SIZE = process.env.PAGE_SIZE;
const INVENTORY_TIME = process.env.INVENTORY_TIME;

function GetPageString(authorId, index) {
    let userCards = GetUserCards(authorId) ; //message.author.id
    if(userCards.length == 0) return `Пока что у вас нет ни одной выбитой карты в инвентаре.`;
    
    cardString = `Вот что у вас в инвентаре: \n`;
    let strings = [];
    // let pageCount = Math.ceil(userCards.length / PAGE_SIZE);
    let start = PAGE_SIZE * (index);
    let end = PAGE_SIZE * (index + 1);

    for(let card of userCards) {
        strings.push(`**${card.name}**  X${card.count}  <${card.url}> \n`);
    }

    let lastPage = "Вот что у вас в инвентаре: \n" ;
    strings.slice(start, end).forEach(card => {lastPage+=card});

    lastPage+=`** страница ${index + 1 } **`; //начинаем показ с последней страницы
    return lastPage;
}

function AwaitReactions(message, authorMessage, pageIndex, pageCount) { // message - that message what contains a user inventory
    const filter = (reaction, user) => {
        return ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === authorMessage.author.id;
    };

    message.awaitReactions(filter, {max: 1, time: INVENTORY_TIME })
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
        let arrInventoryMessagesIndex = InventoryMessages.indexOf(InventoryMessages.find((m) => {return (m.message.id == message.id) }));
        InventoryMessages.splice(arrInventoryMessagesIndex, 1);
        authorMessage.reply('Время действия инвентаря закончилось');
    });
}

async function ChangeInventoryPage(message, pageDirrection) {
    let messageState =  InventoryMessages.find((m) => {return (m.message.id == message.id) })
    if(!messageState ) return;
    let pageIndex = messageState.index + pageDirrection;
    let lastPage = GetPageString(messageState.authorMessage.author.id, pageIndex);
    messageState.index = pageIndex;
    message.edit(lastPage);
    let pageCount = Math.ceil(GetUserCards(messageState.authorMessage.author.id).length / PAGE_SIZE);
    if(pageIndex > 0 ) await message.react('⬅️');
    if(pageIndex < pageCount - 1) await message.react('➡️');
    AwaitReactions(message, messageState.authorMessage, pageIndex, pageCount);
}

function GetUserCards(userId) {
    let obj = ReadDBFile();
    return obj.users.find((user) => {if(userId == user.id) return user.cards}).cards;
}


const ShowCard = async (message) => {
    UserCheck(message.author);
    let userCards = GetUserCards(message.author.id) ; //message.author.id
    if(userCards.length == 0) {
        message.reply(`Пока что у вас нет ни одной выбитой карты в инвентаре.`);
        return;
    }

    cardString = `Вот что у вас в инвентаре: \n`;
    let pageCount = Math.floor(userCards.length / PAGE_SIZE);
    let pageIndex = pageCount;
    let lastPage = GetPageString(message.author.id, pageIndex);

    message.reply(lastPage).then((mes) => {
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