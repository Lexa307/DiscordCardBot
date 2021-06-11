const UserCheck = require("../runtime/UserCheck.js");
const ReadDBFile = require("../runtime/ReadDBFile.js");
const fs = require('fs');

function daysDiff(dt1, dt2) {
  dt2 = new Date(dt2);
  let diffTime = (dt2.getTime() - dt1.getTime());
  let daysDiff = diffTime / (1000 * 3600 * 24); 
  return daysDiff;
}

function showGivenCard(message, card, reRoll = undefined) {
  message.reply(
  `Вам выпала карта с названием: **${card.name}**
  ${card.url} ${(reRoll) ? "\n Поздравляю тебе выпало 3 повторки! 👏👏👏  Можешь попытаться выбить еще одну карту прямо сейчас!" : ""}`);
}

const DropCard = (message, args, client) => {
  UserCheck(message.author);
  let obj = ReadDBFile();
  if (!obj) return;

  for (let i of obj.users ) {
    let finded = true;
    if(i.id == message.author.id) {
        let activeCards = obj.cards.filter((card) => {if(card.active) return card});
        if(activeCards.length == 0) return;
        let rCard = activeCards[ Math.floor(Math.random() * activeCards.length )]; 
        // if(i.lastDropDate == null) {
        let userCard = i.cards.find((item)=>{ if(item.name == rCard.name) return item})

        let update = false;
        if(i.lastDropDate == null) {
          i.lastDropDate = new Date();
          update = true;
        } else {
          if(daysDiff(new Date(), i.lastDropDate ) <= -1) {
            i.lastDropDate = new Date();
            update = true;
          } else {
            let remainingTime = new Date(i.lastDropDate).setMilliseconds(new Date(i.lastDropDate).getMilliseconds() + 86400000 ) - Date.now();
            let remainingHours = Math.floor( remainingTime / 3600000);
            remainingTime -= remainingHours * 3600000;
            let remainingMinutes = Math.floor(remainingTime / 60000);
            remainingTime -= remainingMinutes * 60000;
            let remainingSecs = Math.floor(remainingTime / 1000);
            message.reply(`Сегодня вы уже получали карту, но вы можете попытать удачу через: ${remainingHours}ч ${remainingMinutes }м ${remainingSecs }с`);
          }
        }
        if (update) {
          if (userCard) {
            userCard.count += 1;
          } else {
            i.cards.push(
              {
                "name": rCard.name,
                "count": (userCard) ? userCard.count + 1 : 1,
                "url": rCard.url
              }
            )
          }
          let reRollFlag = undefined;

          if (userCard && userCard.count % 3 == 0) {
            i.lastDropDate = null;
            reRollFlag = true;
          }

          // i.lastDropDate = new Date();
          let json = JSON.stringify(obj, null, "\t");
          fs.writeFileSync('./storage/db.json', json, 'utf8');
          showGivenCard(message, rCard, reRollFlag);
        }
        return;
    }
    if (!finded) RegisterUser(user);
  }
};

module.exports = {
  name: 'daikarty',
  usage() { return `${process.env.PREFIX}${this.name}`; },
  desc: 'Раз в 24 часа рандомная карта помещается вам в инвентарь при использовании этой команды',
  func: DropCard,
};
