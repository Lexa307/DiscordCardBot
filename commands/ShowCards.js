const UserCheck = require("../runtime/UserCheck.js");
const ReadDBFile = require("../runtime/ReadDBFile.js");

const ShowCard = (message) => {
    UserCheck(message.author);
    let obj = ReadDBFile();
    let userCards = obj.users.find((user) => {if(message.author.id == user.id) return user.cards}).cards;
    if(userCards.length == 0) {
        message.reply(`Пока что у вас нет ни одной выбитой карты в инвентаре.`);
        return;
    }

    cardString = `Вот что у вас в инвентаре: \n`
    for(let card of userCards) {
        cardString += `**${card.name}**  X${card.count}  <${card.url}> \n`;
    }
    message.reply(cardString);
}

module.exports = {
    name: 'pokajimne',
    usage() { return `${process.env.PREFIX}${this.name}`; },
    desc: 'Показывает карты, которые у вас в инвентаре',
    func: ShowCard,
};