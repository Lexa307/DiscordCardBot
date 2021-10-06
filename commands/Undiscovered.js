const UserCheck = require("../runtime/UserCheck.js");
const ReadDBFile = require("../runtime/ReadDBFile.js");

const NoOneElseHas = (message, args, client) => {
    UserCheck(message.author);
    let obj = ReadDBFile();
    let undiscoveredCounter = 0;
    if (!obj.cards.length) {
        message.reply(`Сначала добавьте карты в базу, перед тем как заставлять меня считать то, чего нет!`);
        return;
    } 
    if (!obj.users.length) {
        message.reply(`Не у кого считать карты!`);
        return;
    }

    for (let card of obj.cards) {
        
        let finded = false;
        let usr = obj.users.find( user => {  return  user.cards.find( c =>  { return c.name == card.name } )  });
        
        (!!usr) ? finded = true : undiscoveredCounter++
    }
    message.reply(`На данный момент количество карт, которых не повидал сервер: **${undiscoveredCounter}** `)
}

module.exports = {
    name: 'undiscovered',
    usage() { return `${process.env.PREFIX}${this.name}`; },
    desc: 'Показывает количество карт, которых нет ни у одного из участников',
    func: NoOneElseHas,
};