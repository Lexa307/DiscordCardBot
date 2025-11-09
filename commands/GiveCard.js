const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const CONSTANTS = require ("../constants/constants.js");
const FindCardByName = require("../utils/FindCardByName.js");
const GetClassString = require("../utils/GetClassString.js");
const GetUserFromMention = require("../utils/GetUserFromMention.js");
const ReplaceEmojisFromNameToClass = require("../utils/ClassFromName.js");
const SaveObjToDB = require("../utils/SaveObjToDB.js");
const {EmbedBuilder, PermissionsBitField} = require('discord.js');
const LOCALES = require("../constants/locales.js");

/**
 * Optimized: Checks if a URL ends with ".mp4" (case-insensitive for safety).
 * @param {string} url The card URL.
 * @returns {boolean} True if the URL ends with .mp4.
 */
function isUrlMp4(url) {
    if (!url || typeof url !== 'string') return false;
    // Use .toLowerCase() and endsWith for robustness
    return url.toLowerCase().endsWith(".mp4");
}

/**
 * Constructs and sends the confirmation message after a card is given.
 * Uses async/await for cleaner user fetching.
 * @param {Object} message The Discord message object.
 * @param {Object} card The master card object (with name, url).
 * @param {Object} obj The full database object.
 * @param {Object} client The Discord client object.
 * @param {string} memberId The ID of the recipient user.
 * @param {number} addCardCount The number of cards given.
 */
async function showGivenCard(message, card, obj, client, memberId, addCardCount = 1) {
    // Optimized: Find card class once
    const masterCard = obj.cards.find(cardDB => cardDB.name == card.name);
    const cardClassNumber = masterCard ? masterCard.class : 0;
    const cardClassString = GetClassString(cardClassNumber);
    
    let memberName;
    let authorUser;

    try {
        // Fetch users concurrently
        [memberName, authorUser] = await Promise.all([
            client.users.fetch(memberId).then(user => user.username),
            client.users.fetch(message.author.id)
        ]);
    } catch (error) {
        console.error("Error fetching users for showGivenCard:", error);
        memberName = memberId; // Fallback
        authorUser = message.author; // Fallback
    }

    const embed = new EmbedBuilder()
        .setColor(0xd1b91f)
        .setAuthor({
            name: authorUser.username, 
            iconURL: authorUser.displayAvatarURL()
        })
        .setTitle(`${LOCALES.GiveCard__MessageEmbed__issued_a_card[CONSTANTS.LANG]} ${memberName}:`)
        .setDescription(`**${(cardClassString) ? cardClassString : ReplaceEmojisFromNameToClass(card)} [${card.name}](${card.url})**`)
        .setFooter({text: `${LOCALES.DropCard__MessageEmbed__cards_you_have_now[CONSTANTS.LANG]} ${addCardCount}`}); // в количестве

    // Handle video/image display
    if (isUrlMp4(card.url)) {
        // Embed image is null for videos; the video URL is sent separately
        embed.addFields({
            name: "🎥 Video Card",
            value: `${LOCALES.ShowCards__VideoCardViewerBelow[CONSTANTS.LANG]}`,
            inline: false
        });
    } else {
        // Standard image/GIF
        embed.setImage(card.url);
    }

    // Send the main embed
    await message.reply({ embeds: [embed] });
    
    // Send the video link separately if it's an MP4
    if (isUrlMp4(card.url)) {
        await message.channel.send(card.url);
    }
}

/**
 * Main command function for giving a card. Renamed from RoleTeter to GiveCardCommand.
 */
function GiveCardCommand(message, args, client) {
    UserCheck(message.author.id);
    
    if (!message.guild) return;
    // Check for explicit Administrator permission
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        return; 
    }

    let memberId;
    // 1. Get Member ID
    if (args[0]) {
        const member = GetUserFromMention(args[0]);
        if (!member) {
            message.reply(`${LOCALES.GiveCard__MessageEmbed__wrong_user[CONSTANTS.LANG]}`);
            return;
        }
        memberId = member.id;
    } else {
        // Must specify a user to give a card to
        message.reply("You must specify a user to give the card to.");
        return;
    }
    
    UserCheck(memberId);

    // 2. Get Card
    if (!args[1]) {
        message.reply("You must specify a card name.");
        return;
    }
    
    const card = FindCardByName(message, args[1]);
    if (!card) {
        // FindCardByName should handle the error message if card is not found
        return; 
    }

    // 3. Get Count
    let addCardCount = 1;
    if (args[2]) {
        const customAddNumber = parseInt(args[2], 10);
        if (isNaN(customAddNumber) || customAddNumber < 1) {
            message.reply("The card count must be a positive number.");
            return;
        }
        addCardCount = customAddNumber;
    }

    // 4. Update Database
    const obj = ReadDBFile();
    const user = obj.users.find(usr => usr.id == memberId);
    
    // Safety check (UserCheck should have created the user, but ensures safety)
    if (!user) {
        message.reply("An internal error occurred: User not found in database after check.");
        return;
    }
    
    const userCard = user.cards.find(item => item.name == card.name);

    if (userCard) {
        // Card exists: Update count and URL
        userCard.count += addCardCount;
        userCard.url = card.url; // Ensure URL is always updated from master card
    } else {
        // Card does not exist: Add new card
        user.cards.push({
            "name": card.name,
            "count": addCardCount,
            "url": card.url
        });
    }

    SaveObjToDB(obj);
    
    // 5. Show Confirmation
    // showGivenCard is called without await, allowing the command to finish faster, 
    // but the function itself handles the asynchronous message sending.
    showGivenCard(message, card, obj, client, memberId, addCardCount);
}

module.exports = {
    name: `${LOCALES.GiveCard__EXPORTS__name[CONSTANTS.LANG]}`, // выдайкарту
    usage() { return `${CONSTANTS.PREFIX}${this.name} @UserMention CardName [count]`; },
    desc: `${LOCALES.GiveCard__EXPORTS__desc[CONSTANTS.LANG]}`,
    func: GiveCardCommand, // Renamed function
    permission: 'ADMINISTRATOR'
};