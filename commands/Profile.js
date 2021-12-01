const UserCheck = require("../runtime/UserCheck.js");
const ReadDBFile = require("../runtime/ReadDBFile.js");
const Discord = require('discord.js');
const CONSTANTS = require ("../constants/constants.js");
const ReplaceEmojisFromNameToClass = require("../runtime/ClassFromName.js");
const GetClassString = require("../runtime/GetClassString.js");
const GetUserFromMention = require("../runtime/GetUserFromMention.js");

function GetUserCards(userId) {
    let obj = ReadDBFile();
    return obj.users.find((user) => {if (userId == user.id) return user.cards}).cards;
}


const ShowProfile = (message, args, client) => {
    UserCheck(message.author);
    let member;
    if (args[0]) {
        member = GetUserFromMention(args[0]);
        if (!member) message.channel.send(error('Для просмотра профиля учатника необходимо упомянуть только его')); 
    } else {
        member = message.author.id;
    }
    UserCheck(member);
    let obj = ReadDBFile();
    let embed = new Discord.MessageEmbed();
    client.users.fetch(member).then(user => {
        embed.setThumbnail(user.displayAvatarURL());
        embed.setTitle(`Профиль участника ${user.username}`);
        let userCards = GetUserCards(member);
        let totalCardCount = userCards.reduce((sum, current) => {
            return sum += current.count;
        }, 0);
        embed.addField(`** Сколько всего карт выпало : ${totalCardCount}**`, `** **`); 

        // console.log(userCards);
        if (userCards.length > 0) {
            embed.addField(`** Статистика выпавших карт :**`, `** **`);
            for (let cardClass = 1; cardClass <= CONSTANTS.RARE_CLASS_NUMBER; cardClass++) {
                let totalClassCount = obj.cards.filter((card)=>{return card.class == cardClass}).length;
                let classCount = userCards.filter(card => { return (obj.cards.find(cardDB => {return cardDB.name == card.name}).class == cardClass)}).length;
                embed.addField(`${GetClassString(cardClass)}:    ${classCount} из ${totalClassCount} `, `** **`);
            }

            let remainingCards = obj.cards.length - userCards.length;
            embed.addField(`** Сколько карт еще не открыто : ${remainingCards}**`, `** **`);
            
            let sortedCardArray = userCards.sort((a,b) => {return a.count - b.count});
            let card = sortedCardArray[sortedCardArray.length -1];
            let cardClass = obj.cards.find(cardDB => {return cardDB.name == card.name}).class;
            let cardClassString = GetClassString(cardClass);
            embed.addField(`** Карта, которая больше всего раз выпала : **`, `${(cardClassString) ? cardClassString : ReplaceEmojisFromNameToClass(card)} [${card.name}](${card.url }) X${card.count} `);
            embed.setImage(card.url);
            message.reply(embed);
        } else {
            embed.addField('** У пользователя на данный момент нет карт**', `** **`);
        }
    })
}

module.exports = {
    name: 'profile',
    usage() { return `${CONSTANTS.PREFIX}${this.name} || ${CONSTANTS.PREFIX}${this.name} @UserMention `; },
    desc: 'Показывает профиль пользователя, содержащий информацию о статистике выпавших ему карт',
    func: ShowProfile,
};