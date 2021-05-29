const UserCheck = require("../runtime/UserCheck.js");
const ReadDBFile = require("../runtime/ReadDBFile.js");
const fs = require('fs');

function daysDiff(dt1, dt2) {
  dt2 = new Date(dt2);
  let diffTime = (dt2.getTime() - dt1.getTime());
  let daysDiff = diffTime / (1000 * 3600 * 24); 
  return daysDiff;
}

function showGivenCard(message, card) {
  message.reply(
  `Вам выпала карта с названием: **${card.name}**
  ${card.url} `);
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
        if(i.lastDropDate == null) {
          i.cards.push(
            {
              "name": rCard.name,
              "count": 1,
              "url": rCard.url
            }
          )
          i.lastDropDate = new Date();
          let json = JSON.stringify(obj, null, "\t");
          fs.writeFileSync('./storage/db.json', json, 'utf8');
          showGivenCard(message, rCard);
          return;
        } else {
          
          if(daysDiff(new Date(), i.lastDropDate ) <= -1) {
            let userCard = i.cards.find((item)=>{ if(item.name == rCard.name) return item});
            if (userCard) {
              userCard.count += 1;
            } else {
              i.cards.push(
                {
                  "name": rCard.name,
                  "count": 1,
                  "url": rCard.url
                }
              )
            }
            i.lastDropDate = new Date();
            let json = JSON.stringify(obj, null, "\t");
            fs.writeFileSync('./storage/db.json', json, 'utf8');
            showGivenCard(message, rCard);
            return;
          } else {
            message.reply(`Сегодня вы уже получали карту, но вы можете попытать анус завтра`)
          }
        }
    }
    if (!finded) RegisterUser(user);
  }
};

module.exports = {
  name: 'daikarty',
  usage() { return `${process.env.PREFIX}${this.name}`; },
  desc: 'Раз в день рандомная карта помещается вам в инвентарь при использовании этой команды',
  func: DropCard,
};
