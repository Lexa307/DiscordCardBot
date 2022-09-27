const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const {EmbedBuilder} = require('discord.js');
const CONSTANTS = require ("../constants/constants.js");
const ReplaceEmojisFromNameToClass = require("../utils/ClassFromName.js");
const GetClassString = require("../utils/GetClassString.js");
const GetUserFromMention = require("../utils/GetUserFromMention.js");
const LOCALES = require("../constants/locales.js");

function GetUserCards(userId) {
    let obj = ReadDBFile();
    return obj.users.find((user) => { if (userId == user.id) return user.cards}).cards;
}

const ShowProfile = (message, args, client) => {
    UserCheck(message.author.id);
    let member;
    if (args[0]) {
        member = GetUserFromMention(args[0]);
        if (!member) message.channel.send(`${LOCALES.Profile__MessageEmbed__wrong_user[CONSTANTS.LANG]}`); // Для просмотра профиля учатника необходимо упомянуть только его
    } else {
        member = message.author.id;
    }
    UserCheck(member);
    let obj = ReadDBFile();
    let embed = new EmbedBuilder();
    client.users.fetch(member).then(user => {
        embed.setThumbnail(user.displayAvatarURL());
        embed.setTitle(`${LOCALES.Profile__MessageEmbed__user_profile[CONSTANTS.LANG]} ${user.username}`); // Профиль участника
        let userCards = GetUserCards(member);
        let totalCardCount = userCards.reduce((sum, current) => {
            return sum += current.count;
        }, 0);
        embed.addFields({name: `**${LOCALES.Profile__MessageEmbed__cards_fallen_total[CONSTANTS.LANG]} ${totalCardCount}**`, value: `** **`}); // Сколько всего карт выпало :

        if (userCards.length > 0) {
            embed.addFields({name: `**${LOCALES.Profile__MessageEmbed__statistics_of_dropped_cards[CONSTANTS.LANG]}**`, value: `** **`}); // Статистика выпавших карт
            for (let cardClass = 1; cardClass <= CONSTANTS.RARE_CLASS_NUMBER; cardClass++) {
                let totalClassCount = obj.cards.filter(card => { return card.class == cardClass}).length;
                let classCount = userCards.filter(card => { return (obj.cards.find(cardDB => { return cardDB.name == card.name}).class == cardClass)}).length;
                embed.addFields({name: `${GetClassString(cardClass)}:    ${classCount} ${LOCALES.Profile__MessageEmbed__of[CONSTANTS.LANG]} ${totalClassCount} `, value: `** **`});
            }
            
            let totalNonStandatClassCount = obj.cards.filter((card)=>{ return ((card.class > CONSTANTS.RARE_CLASS_NUMBER) || (card.class <= 0)) }).length;
            if (totalNonStandatClassCount) {
                // embed.addField(``, `** **`); //  Собрано нестандартных карт :
                let classNonStandatCount = userCards.filter(card => {cClass = obj.cards.find(cardDB => { return cardDB.name == card.name}).class; return (cClass > CONSTANTS.RARE_CLASS_NUMBER || cClass <=0 )}).length;
                embed.addFields({name: `**${LOCALES.Profile__MessageEmbed__collected_non_standard_cards[CONSTANTS.LANG]} ${classNonStandatCount} ${LOCALES.Profile__MessageEmbed__of[CONSTANTS.LANG]} ${totalNonStandatClassCount}**`, value: `** **`});
            } 

            let remainingCards = obj.cards.length - userCards.length;
            embed.addFields({name: `**${LOCALES.Profile__MessageEmbed__not_been_opened_yet[CONSTANTS.LANG]} ${remainingCards}**`, value: `** **`}); //  Сколько карт еще не открыто :
            
            let sortedCardArray = userCards.sort((a,b) => { return a.count - b.count});
            let card = sortedCardArray[sortedCardArray.length -1];
            let cardClass = obj.cards.find(cardDB => { return cardDB.name == card.name}).class;
            let cardClassString = GetClassString(cardClass);
            embed.addFields({name: `**${LOCALES.Profile__MessageEmbed__fell_out_the_most_times[CONSTANTS.LANG]} **`, value: `${(cardClassString) ? cardClassString : ReplaceEmojisFromNameToClass(card)} [${card.name}](${card.url }) X${card.count} `}); //  Карта, которая больше всего раз выпала :
            embed.setImage(card.url);
            message.reply({embeds: [embed]});
        } else {
            message.reply(`**${user.username} ${LOCALES.Profile__MessageEmbed__no_cards_in_the_inventory[CONSTANTS.LANG]}**`);
        }
    })
}

module.exports = {
    name: `${LOCALES.Profile__EXPORTS__name[CONSTANTS.LANG]}`,
    usage() { return `${CONSTANTS.PREFIX}${this.name} || ${CONSTANTS.PREFIX}${this.name} @UserMention `; },
    desc: `${LOCALES.Profile__EXPORTS__desc[CONSTANTS.LANG]}`,
    func: ShowProfile,
};