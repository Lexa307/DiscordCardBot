// You might need to adjust the paths to your utility files and constants
const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const { EmbedBuilder } = require('discord.js');
const CONSTANTS = require ("../constants/constants.js");
const ReplaceEmojisFromNameToClass = require("../utils/ClassFromName.js");
const GetClassString = require("../utils/GetClassString.js");
// Removed GetUserFromMention as message.mentions is preferred in modern DJS
const LOCALES = require("../constants/locales.js");

// --- Utility Functions (Keep them or move them) ---

/**
 * Reads the DB and finds a user's cards based on userId.
 * Note: This function re-reads the DB every call, which might be inefficient.
 */
function GetUserCards(userId) {
    const obj = ReadDBFile();
    // Use find for efficiency, then optional chaining for safety
    return obj.users.find(user => userId == user.id)?.cards || []; 
}

function isUrlMp4(url) {
    if (!url) return false;
    // Checks if the URL ends with '.mp4'
    return url.toLowerCase().endsWith(".mp4");
}

// --- Main Command Function (using async/await) ---

const ShowProfile = async (message, args, client) => {
    // 1. Determine target user ID
    let targetUser = message.author;
    let memberId;

    // Check if a mention was provided in args[0]
    if (args[0]) {
        // Use mentions collection for a more reliable check
        const mentionedUser = message.mentions.users.first();
        if (mentionedUser) {
            targetUser = mentionedUser;
        } else {
            // Handle error if argument is present but not a valid mention
            // Note: Your old logic assumed GetUserFromMention handled ID lookup or error
            // For simplicity with mentions, we stick to the error message.
            message.channel.send(`${LOCALES.Profile__MessageEmbed__wrong_user[CONSTANTS.LANG]}`);
            return;
        }
    }
    
    memberId = targetUser.id;

    // 2. Perform initial checks and read data
    UserCheck(message.author.id); // Check the message author
    UserCheck(memberId);         // Check the target member
    
    const dbObj = ReadDBFile();
    const userCards = GetUserCards(memberId);
    
    // 3. Fetch User (needed for avatar/username, though we have targetUser)
    // Using await for cleaner flow
    let user;
    try {
        // Fetch the user object if it's not already cached (e.g., if targetUser was only an ID)
        // Since we are using targetUser = message.mentions.users.first() or message.author, this is redundant but kept for robustness.
        user = await client.users.fetch(memberId);
    } catch (e) {
        console.error("Error fetching user:", e);
        message.channel.send(`${LOCALES.Profile__MessageEmbed__wrong_user[CONSTANTS.LANG]}`);
        return;
    }


    // 4. Handle Case: No Cards
    if (userCards.length == 0) {
        message.reply({ 
            content: `**${user.username} ${LOCALES.Profile__MessageEmbed__no_cards_in_the_inventory[CONSTANTS.LANG]}**` 
        });
        return;
    }
    
    // 5. Build Embed
    const embed = new EmbedBuilder()
        .setThumbnail(user.displayAvatarURL())
        .setTitle(`${LOCALES.Profile__MessageEmbed__user_profile[CONSTANTS.LANG]} ${user.username}`)
        .setColor(0x0099ff); // Optional: Set a color

    // Total Card Count
    const totalCardCount = userCards.reduce((sum, current) => sum + current.count, 0);
    embed.addFields({
        name: `**${LOCALES.Profile__MessageEmbed__cards_fallen_total[CONSTANTS.LANG]} ${totalCardCount}**`, 
        value: `** **`
    });

    // Statistics Header
    embed.addFields({
        name: `**${LOCALES.Profile__MessageEmbed__statistics_of_dropped_cards[CONSTANTS.LANG]}**`, 
        value: `** **`
    }); 

    // Card Class Statistics Loop
    for (let cardClass = 1; cardClass <= CONSTANTS.RARE_CLASS_NUMBER; cardClass++) {
        // Total cards in this class in DB
        const totalClassCount = dbObj.cards.filter(card => card.class == cardClass).length;
        
        // Count of cards from this class collected by the user
        const classCount = userCards.filter(userCard => { 
            const dbCard = dbObj.cards.find(cardDB => cardDB.name == userCard.name);
            return dbCard && dbCard.class == cardClass;
        }).length;
        
        embed.addFields({
            name: `${GetClassString(cardClass)}: ${classCount} ${LOCALES.Profile__MessageEmbed__of[CONSTANTS.LANG]} ${totalClassCount}`, 
            value: `** **`
        });
    }

    // Non-Standard Cards
    const totalNonStandatClassCount = dbObj.cards.filter(card => card.class > CONSTANTS.RARE_CLASS_NUMBER || card.class <= 0).length;
    
    if (totalNonStandatClassCount) {
        const classNonStandatCount = userCards.filter(userCard => {
            const dbCard = dbObj.cards.find(cardDB => cardDB.name == userCard.name);
            const cClass = dbCard ? dbCard.class : 0; // Default to 0 if not found
            return (cClass > CONSTANTS.RARE_CLASS_NUMBER || cClass <= 0);
        }).length;
        
        embed.addFields({
            name: `**${LOCALES.Profile__MessageEmbed__collected_non_standard_cards[CONSTANTS.LANG]} ${classNonStandatCount} ${LOCALES.Profile__MessageEmbed__of[CONSTANTS.LANG]} ${totalNonStandatClassCount}**`, 
            value: `** **`
        });
    } 

    // Remaining Cards
    const remainingCards = dbObj.cards.length - userCards.length;
    embed.addFields({
        name: `**${LOCALES.Profile__MessageEmbed__not_been_opened_yet[CONSTANTS.LANG]} ${remainingCards}**`, 
        value: `** **`
    });

    // Most Dropped Card (Highest count)
    // Sort array by count descending and take the first element
    const sortedCardArray = [...userCards].sort((a, b) => b.count - a.count); 
    const mostDroppedCard = sortedCardArray[0]; // Guaranteed to exist because we checked userCards.length > 0
    
    // Find the class of the most dropped card
    const cardDbInfo = dbObj.cards.find(cardDB => cardDB.name == mostDroppedCard.name);
    const cardClass = cardDbInfo ? cardDbInfo.class : null;
    const cardClassString = cardClass ? GetClassString(cardClass) : '';

    embed.addFields({
        name: `**${LOCALES.Profile__MessageEmbed__fell_out_the_most_times[CONSTANTS.LANG]}**`, 
        // Use a descriptive name if class string is empty
        value: `${cardClassString || ReplaceEmojisFromNameToClass(mostDroppedCard)} [${mostDroppedCard.name}](${mostDroppedCard.url}) X${mostDroppedCard.count}`
    });
    
    // Set image and send reply
    embed.setImage(mostDroppedCard.url);
    
    // v14 uses message.reply({ embeds: [...] })
    await message.reply({ embeds: [embed] }); 

    // Send MP4 URL separately if needed, as DJS embeds struggle with MP4 previews
    if (isUrlMp4(mostDroppedCard.url)) {
        // Use message.channel.send to send the URL without a reply ping
        message.channel.send(mostDroppedCard.url);
    }
}

module.exports = {
    name: `${LOCALES.Profile__EXPORTS__name[CONSTANTS.LANG]}`,
    usage() { return `${CONSTANTS.PREFIX}${this.name} || ${CONSTANTS.PREFIX}${this.name} @UserMention `; },
    desc: `${LOCALES.Profile__EXPORTS__desc[CONSTANTS.LANG]}`,
    func: ShowProfile,
};