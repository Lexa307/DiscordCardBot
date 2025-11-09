const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const CONSTANTS = require ("../constants/constants.js");
const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ComponentType,
    PermissionsBitField // For checking admin permissions
} = require('discord.js');
const ReplaceEmojisFromNameToClass = require("../utils/ClassFromName.js");
const GetClassString = require("../utils/GetClassString.js");
const LOCALES = require('../constants/locales.js');

// --- Utility Functions ---

function GetUserCards(userId) {
    let obj = ReadDBFile();
    // Use optional chaining for safer access and return empty array if user not found
    return obj.users.find(user => userId === user.id)?.cards || [];
}

/**
 * Creates the Embed and ActionRow for a specific page.
 * @param {string} memberId - The ID of the user whose inventory is being viewed.
 * @param {number} pageIndex - The current page index (0-based).
 * @param {boolean} memberIsAuthor - True if the inventory owner is the command issuer.
 * @param {object} dbObj - The full database object.
 * @returns {{embed: EmbedBuilder, row: ActionRowBuilder, pageCount: number}} The embed and button row.
 */
function createInventoryEmbed(memberId, pageIndex, memberIsAuthor, dbObj) {
    const userCards = GetUserCards(memberId);
    const pageCount = Math.ceil(userCards.length / CONSTANTS.PAGE_SIZE);
    
    if(userCards.length === 0) {
        return { 
            embed: new EmbedBuilder().setDescription(`${LOCALES.ShowCards__MessageEmbed__no_cards[CONSTANTS.LANG]}`),
            row: new ActionRowBuilder(),
            pageCount: 0
        };
    }
    
    const start = CONSTANTS.PAGE_SIZE * pageIndex;
    const end = CONSTANTS.PAGE_SIZE * (pageIndex + 1);
    
    const embed = new EmbedBuilder().setColor(0x0f3961);
    
    // Title/Header Field
    const cardString = `**${LOCALES.ShowCards__MessageEmbed__cards_in_inventary1[CONSTANTS.LANG]}${(!memberIsAuthor) ? '<@' + memberId + '>' : `${LOCALES.ShowCards__MessageEmbed__cards_in_inventary2[CONSTANTS.LANG]}` } ${LOCALES.ShowCards__MessageEmbed__cards_in_inventary3[CONSTANTS.LANG]}**`;
    embed.addFields({name: `** **`, value: cardString});

    // Prepare card strings with class info
    const cardDetails = userCards.map(card => {
        const cardDB = dbObj.cards.find(cardDB => cardDB.name === card.name); 
        const cardClassNumber = cardDB ? cardDB.class : 0; 
        const cardClassString = GetClassString(cardClassNumber);
        return {
            name: `--------------------------------------`, 
            value: `${(cardClassString) ? cardClassString : ReplaceEmojisFromNameToClass(card) }[${card.name}](${card.url}) X${card.count}`
        };
    });

    // Add fields for the current page
    embed.addFields(cardDetails.slice(start, end));

    // Footer
    embed.addFields({
        name: `** ${LOCALES.ShowCards__MessageEmbed__page[CONSTANTS.LANG]} ${pageIndex + 1 } / ${pageCount}**`, 
        value: `** **`
    });

    // Create Navigation Buttons AND Delete Button
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('prev_page')
            .setLabel('⬅️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(pageIndex === 0),
        new ButtonBuilder()
            .setCustomId('next_page')
            .setLabel('➡️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(pageIndex === pageCount - 1),
        new ButtonBuilder() 
            .setCustomId('delete_inventory')
            .setLabel('❌')
            .setStyle(ButtonStyle.Danger),
    );

    return { embed, row, pageCount };
}


// --- Main Command Function ---

const ShowCard = async (message, args) => { 
    UserCheck(message.author.id);
    
    // 1. Determine target member ID
    let memberId;
    const mentionedUser = message.mentions.users.first();
    
    if (args[0] && mentionedUser) {
        memberId = mentionedUser.id;
    } else if (args[0]) {
        // Argument provided but not a valid mention
        message.reply({ content: `${LOCALES.ShowCards__MessageEmbed__incorrect_user[CONSTANTS.LANG]}` });
        return;
    } else {
        memberId = message.author.id;
    }

    const authorIsMember = memberId === message.author.id;
    
    // 2. Initial Checks
    UserCheck(memberId);
    
    // Access check
    if (!CONSTANTS.INVENTORY_PUBLIC_ACCESS && memberId !== message.author.id) {
        message.reply({ content: `${LOCALES.ShowCards__MessageEmbed__access_denied[CONSTANTS.LANG]}` });
        return;
    }
    
    const userCards = GetUserCards(memberId);
    if (userCards.length === 0) {
        message.reply({ 
            content: `${ (args[0])?`${LOCALES.ShowCards__MessageEmbed__no_cards2[CONSTANTS.LANG]}`:`${LOCALES.ShowCards__MessageEmbed__no_cards3[CONSTANTS.LANG]}`} ${LOCALES.ShowCards__MessageEmbed__no_cards4[CONSTANTS.LANG]}`
        });
        return;
    }
    
    // 3. Initial Display
    const dbObj = ReadDBFile();
    let currentPageIndex = 0; // Start at page 0 
    
    let { embed: inventoryEmbed, row: buttonRow, pageCount } = createInventoryEmbed(memberId, currentPageIndex, authorIsMember, dbObj);
    
    inventoryEmbed.setAuthor({
        name: message.author.username, 
        iconURL: message.author.displayAvatarURL()
    });
    
    const messageReply = await message.reply({ 
        embeds: [inventoryEmbed], 
        components: [buttonRow] 
    });

    // 4. Create Component Collector for Pagination and Delete
    const collector = messageReply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        // Filter checks for command author or Administrator permission
        filter: async (i) => {
            if (i.user.id === message.author.id) return true; // Command issuer

            // Check for Administrator permission (only works in a guild/server)
            if (i.guild) {
                const member = await i.guild.members.fetch(i.user.id);
                if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return true;
            }
            // Deny access and send a private, temporary error message
            await i.reply({ content: "You do not have permission to use this button.", ephemeral: true });
            return false;
        }, 
        time: CONSTANTS.INVENTORY_TIME // Timeout constant
    });

    collector.on('collect', async i => {
        if (i.customId === 'delete_inventory') {
            await i.deferUpdate(); // Acknowledge interaction
            await messageReply.delete();
            collector.stop('deleted'); // Stop the collector after deletion
            return;
        }

        // Pagination Logic
        await i.deferUpdate();

        if (i.customId === 'prev_page') {
            currentPageIndex = Math.max(0, currentPageIndex - 1);
        } else if (i.customId === 'next_page') {
            currentPageIndex = Math.min(pageCount - 1, currentPageIndex + 1);
        }

        // Recreate the embed and buttons for the new page
        const { embed: newEmbed, row: newRow } = createInventoryEmbed(memberId, currentPageIndex, authorIsMember, dbObj);
        
        newEmbed.setAuthor({
            name: message.author.username, 
            iconURL: message.author.displayAvatarURL()
        });

        // Edit the message
        await messageReply.edit({ 
            embeds: [newEmbed], 
            components: [newRow] 
        });
    });

    collector.on('end', async (collected, reason) => {
        // Only disable buttons if the collector timed out
        if (reason === 'time') { 
            const disabledRow = new ActionRowBuilder().addComponents(
                buttonRow.components.map(component => 
                    ButtonBuilder.from(component).setDisabled(true)
                )
            );
            
            try {
                await messageReply.edit({ 
                    components: [disabledRow] 
                });
            } catch (error) {
                // Ignore errors if the message was already deleted
            }
        }
    });
}

module.exports = {
    name: `${LOCALES.ShowCards__EXPORTS__name[CONSTANTS.LANG]}`,
    usage() { return `${CONSTANTS.PREFIX}${this.name} || ${CONSTANTS.PREFIX}${this.name} @UserMention `; },
    desc: `${LOCALES.ShowCards__EXPORTS__desc[CONSTANTS.LANG]}`,
    func: ShowCard,
};