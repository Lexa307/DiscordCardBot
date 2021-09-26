const UserCheck = require("../runtime/UserCheck.js");
const ReadDBFile = require("../runtime/ReadDBFile.js");
const Discord = require('discord.js');
const classSymbolFill = process.env.CLASS_SYMBOL_FILL;
const classSymbolVoid = process.env.CLASS_SYMBOL_OF_VOID;
const totalRareClasses = process.env.RARE_CLASS_NUMBER;

function GetUserCards(userId) {
    let obj = ReadDBFile();
    return obj.users.find((user) => {if (userId == user.id) return user.cards}).cards;
}

function GetClassString (cardClass) {
    let cardClassString = "";
    let fillCount;
    for (fillCount = 0; fillCount < cardClass; fillCount++) {
        cardClassString += classSymbolFill;
    }

    for (fillCount; fillCount < totalRareClasses; fillCount++) {
        cardClassString += classSymbolVoid;
    }
    return cardClassString;
}

function getUserFromMention(mention) {
    const matches = mention.match(/^<@!?(\d+)>$/);
    if (!matches) return;
    return matches[1]; // user id
}

const ShowProfile = (message, args, client) => {
    UserCheck(message.author);
    let member;
    if (args[0]) {
        member = getUserFromMention(args[0]);
        if (!member) { message.channel.send(error('Для просмотра профиля учатника необходимо упомянуть только его')); }
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
            for (let cardClass = 1; cardClass <= totalRareClasses; cardClass++) {
                let classCount = userCards.filter(card => { return (obj.cards.find(cardDB => {return cardDB.name == card.name}).class == cardClass)}).length;
                // let cardClassString = "";
                // let fillCount;
                // for (fillCount = 0; fillCount < cardClass; fillCount++) {
                //     cardClassString += classSymbolFill;
                // }
        
                // for (fillCount; fillCount < totalRareClasses; fillCount++) {
                //     cardClassString += classSymbolVoid;
                // }
                
                embed.addField(`${GetClassString(cardClass)}:    ${classCount} `, `** **`);
            }

            let remainingCards = obj.cards.length - userCards.length;
            embed.addField(`** Сколько карт еще не открыто : ${remainingCards}**`, `** **`);
            
            let sortedCardArray = userCards.sort((a,b) => {return a.count - b.count});
            let cardClass = obj.cards.find(cardDB => {return cardDB.name == sortedCardArray[sortedCardArray.length -1].name}).class ;
            let cardClassString = GetClassString (cardClass);
            embed.addField(`** Карта, которая больше всего раз выпала : **`, `${(cardClass <= totalRareClasses)?cardClassString:""} ${sortedCardArray[sortedCardArray.length -1].name} X${sortedCardArray[sortedCardArray.length -1].count} ${sortedCardArray[sortedCardArray.length -1].url }`);
            embed.setImage(sortedCardArray[sortedCardArray.length -1].url);
            message.reply(embed);
        } else {
            embed.addField('** У пользователя на данный момент нет карт**', `** **`);
        }
    })
}

module.exports = {
    name: 'profile',
    usage() { return `${process.env.PREFIX}${this.name} || ${process.env.PREFIX}${this.name} @UserMention `; },
    desc: 'Показывает профиль пользователя, содержащий информацию о статистике выпавших ему карт',
    func: ShowProfile,
};