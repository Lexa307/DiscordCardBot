const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const CONSTANTS = require ("../constants/constants.js");
const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ComponentType,
    PermissionsBitField
} = require('discord.js');
const ReplaceEmojisFromNameToClass = require("../utils/ClassFromName.js");
const GetClassString = require("../utils/GetClassString.js");
const LOCALES = require('../constants/locales.js');

// --- EMOJI HELPERS & CONSTANTS ---

/**
 * Returns a single Unicode emoji for use in ButtonBuilder.setEmoji()
 * Also defines the visual rarity mapping.
 * @param {number} cardClass - The class number (1-5).
 * @returns {string} A single Unicode emoji.
 */
function GetButtonEmoji(cardClass) {
    switch (cardClass) {
        case 1:
            return '⚪'; // Common
        case 2:
            return '🟢'; // Uncommon
        case 3:
            return '🔵'; // Rare
        case 4:
            return '🔴'; // Epic
        case 5:
            return '🟡'; // Legendary
        default:
            return '❓';
    }
}

/**
 * Returns the descriptive rarity name.
 * @param {number} cardClass - The class number (1-5).
 * @returns {string} The rarity name.
 */
function GetRarityName(cardClass) {
    switch (cardClass) {
        case 1: return 'Common';
        case 2: return 'Uncommon';
        case 3: return 'Rare';
        case 4: return 'Epic';
        case 5: return 'Legendary';
        default: return `Class ${cardClass}`; // Fallback for safety
    }
}


const NON_STANDARD_LABEL = 'Non-Standard';
const NON_STANDARD_EMOJI = '✨'; // Safe Unicode emoji for Non-Standard

// --- Utility Functions ---

function GetUserCards(userId) {
    let obj = ReadDBFile();
    return obj.users.find(user => userId === user.id)?.cards || [];
}

function getDetailedUserCards(userCards, dbObj) {
    return userCards.map(userCard => {
        const dbCard = dbObj.cards.find(cardDB => cardDB.name === userCard.name); 
        const cardClassNumber = dbCard ? dbCard.class : 0;
        const cardClassString = GetClassString(cardClassNumber);
        return {
            ...userCard,
            class: cardClassNumber,
            classString: cardClassString,
            dbCard: dbCard
        };
    });
}

// --- Category View Renderer ---

/**
 * Creates the Embed and ActionRow for the Category List View.
 */
function createCategoryEmbed(memberId, memberIsAuthor, dbObj) {
    const userCards = GetUserCards(memberId);
    const detailedCards = getDetailedUserCards(userCards, dbObj);

    const embed = new EmbedBuilder()
        .setColor(0x0f3961)
        .setTitle(`**${LOCALES.ShowCards__MessageEmbed__cards_in_inventary1[CONSTANTS.LANG]} ${(!memberIsAuthor) ? `<@${memberId}>` : `${LOCALES.ShowCards__MessageEmbed__cards_in_inventary2[CONSTANTS.LANG]}` } ${LOCALES.ShowCards__MessageEmbed__cards_in_inventary3[CONSTANTS.LANG]}**`);

    let fieldContent = "";
    const totalCardCount = dbObj.cards.length;
    let buttonRows = [];
    let currentRow = new ActionRowBuilder();

    // 1. Standard Classes (1 to 5)
    for (let cardClass = 1; cardClass <= 5; cardClass++) {
        const totalInClass = dbObj.cards.filter(c => c.class === cardClass).length;
        const userInClass = detailedCards.filter(c => c.class === cardClass).length;
        
        const classStringForEmbed = GetClassString(cardClass); 
        const buttonEmoji = GetButtonEmoji(cardClass); 
        const rarityName = GetRarityName(cardClass); // Use new helper for rarity name
        
        const classButtonLabel = `${rarityName} (${userInClass})`; 
        
        fieldContent += `${classStringForEmbed}: **${userInClass} / ${totalInClass}**\n`;

        const classButton = new ButtonBuilder()
            .setCustomId(`category_${cardClass}`)
            .setLabel(classButtonLabel) // Label uses Common/Legendary
            .setEmoji(buttonEmoji) 
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(userInClass === 0);
        
        currentRow.addComponents(classButton);
        
        if (currentRow.components.length === 5) { 
            buttonRows.push(currentRow);
            currentRow = new ActionRowBuilder();
        }
    }

    // Push the partially filled standard row
    if (currentRow.components.length > 0) {
        buttonRows.push(currentRow);
        currentRow = new ActionRowBuilder();
    }
    
    // 2. Non-Standard Cards (Class < 1 or Class > 5)
    const nonStandardFilter = (c) => c.class < 1 || c.class > 5;
    const totalNonStandard = dbObj.cards.filter(nonStandardFilter).length;
    const userNonStandard = detailedCards.filter(nonStandardFilter).length;
    
    if (totalNonStandard > 0) {
        fieldContent += `\n${NON_STANDARD_EMOJI} ${NON_STANDARD_LABEL}: **${userNonStandard} / ${totalNonStandard}**\n`;

        const nonStandardButton = new ButtonBuilder()
            .setCustomId('category_nonstandard')
            .setLabel(`${NON_STANDARD_LABEL} (${userNonStandard})`) 
            .setEmoji(NON_STANDARD_EMOJI) 
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(userNonStandard === 0);

        currentRow.addComponents(nonStandardButton);
    }

    // Push the final row (containing non-standard button if applicable)
    if (currentRow.components.length > 0) {
        buttonRows.push(currentRow);
    }

    embed.setDescription(fieldContent);
    embed.addFields({
        name: `**${LOCALES.ShowCards__MessageEmbed__total[CONSTANTS.LANG]}:**`,
        value: `**${userCards.length} / ${totalCardCount}**`
    });
    
    return { embed, rows: buttonRows };
}

// --- Card View Renderer ---

/**
 * Creates the Embed and ActionRow for the filtered Card List View.
 */
function createCardEmbed(memberId, cardClass, pageIndex, dbObj) {
    const userCards = GetUserCards(memberId);
    const detailedCards = getDetailedUserCards(userCards, dbObj);

    // 1. Filter the cards based on the requested class
    let filteredCards;
    let className;

    if (cardClass === 'nonstandard') {
        filteredCards = detailedCards.filter(c => c.class < 1 || c.class > 5);
        className = "Non-Standard Cards";
    } else {
        const classNumber = parseInt(cardClass);
        filteredCards = detailedCards.filter(c => c.class === classNumber);
        // The header for the card view uses the full class string (e.g., Legendary ⭐⭐⭐⭐⭐)
        className = GetClassString(classNumber);
    }
    
    const pageCount = Math.ceil(filteredCards.length / CONSTANTS.PAGE_SIZE);
    
    if(filteredCards.length === 0) {
        return { 
            embed: new EmbedBuilder().setDescription(`No cards found in category: ${className}`),
            row: new ActionRowBuilder(),
            pageCount: 0
        };
    }
    
    const start = CONSTANTS.PAGE_SIZE * pageIndex;
    const end = CONSTANTS.PAGE_SIZE * (pageIndex + 1);
    
    const embed = new EmbedBuilder()
        .setColor(0x0f3961)
        .setTitle(`${LOCALES.ShowCards__MessageEmbed__category[CONSTANTS.LANG]}: ${className}`);
    
    // Add card fields
    const cardFields = filteredCards.slice(start, end).map(card => ({
        name: `--------------------------------------`, 
        value: `${card.classString || ReplaceEmojisFromNameToClass(card)} [${card.name}](${card.url}) X${card.count}`
    }));
    embed.addFields(cardFields);

    // Footer
    embed.addFields({
        // FIXED: Changed 'index' to 'pageIndex' to fix ReferenceError
        name: `** ${LOCALES.ShowCards__MessageEmbed__page[CONSTANTS.LANG]} ${pageIndex + 1 } / ${pageCount}**`, 
        value: `** **`
    });

    // Create Navigation Buttons (Prev, Next, Back)
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
        new ButtonBuilder() // Back Button
            .setCustomId('back_to_category')
            .setLabel('List ↩️')
            .setStyle(ButtonStyle.Success)
    );
    
    return { embed, row, pageCount };
}


// --- Main Command Function ---

const ShowCard = async (message, args) => { 
    UserCheck(message.author.id);
    
    // 1. Initialization and Checks
    let memberId = message.author.id;
    const mentionedUser = message.mentions.users.first();
    
    if (args[0] && mentionedUser) {
        memberId = mentionedUser.id;
    } else if (args[0]) {
        message.reply({ content: `${LOCALES.ShowCards__MessageEmbed__incorrect_user[CONSTANTS.LANG]}` });
        return;
    }

    const authorIsMember = memberId === message.author.id;
    
    UserCheck(memberId);
    
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
    
    // 2. State Variables
    const dbObj = ReadDBFile();
    let currentPageIndex = 0; 
    let isCategoryView = true;
    let currentCategory = null; 
    let pageCount = 0;

    // 3. Update Message Function
    const updateMessage = async (interaction) => {
        let newEmbed;
        let newComponents = [];

        if (isCategoryView) {
            const result = createCategoryEmbed(memberId, authorIsMember, dbObj);
            newEmbed = result.embed;
            newComponents = result.rows;
            pageCount = 0; 
            
            // Ensure the Delete button is appended to the last row
            let lastRow = newComponents[newComponents.length - 1] || new ActionRowBuilder();
            
            if (!lastRow.components.some(c => c.customId === 'delete_inventory')) {
                 lastRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId('delete_inventory')
                        .setLabel('❌')
                        .setStyle(ButtonStyle.Danger)
                );
            }
            if (newComponents.length === 0 || newComponents[newComponents.length - 1] !== lastRow) {
                newComponents.push(lastRow);
            }


        } else {
            const result = createCardEmbed(memberId, currentCategory, currentPageIndex, dbObj);
            newEmbed = result.embed;
            
            // Add the delete button to the card view row
            const cardRow = result.row;
            cardRow.addComponents(
                new ButtonBuilder()
                    .setCustomId('delete_inventory')
                    .setLabel('❌')
                    .setStyle(ButtonStyle.Danger)
            );
            newComponents = [cardRow];
            pageCount = result.pageCount;
        }

        newEmbed.setAuthor({
            name: message.author.username, 
            iconURL: message.author.displayAvatarURL()
        });

        const editOptions = {
            embeds: [newEmbed],
            components: newComponents
        };
        
        if (interaction) {
            await interaction.editReply(editOptions);
        } else {
            return await message.reply(editOptions);
        }
        return pageCount;
    };
    
    // 4. Initial Display
    const messageReply = await updateMessage(null);

    // 5. Collector Logic
    const collector = messageReply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        filter: async (i) => {
            if (i.user.id === message.author.id) return true; 

            if (i.customId === 'delete_inventory' && i.guild) {
                const member = await i.guild.members.fetch(i.user.id);
                if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return true;
            }
            await i.reply({ content: "You do not have permission to use this button.", ephemeral: true });
            return false;
        }, 
        time: CONSTANTS.INVENTORY_TIME 
    });

    collector.on('collect', async i => {
        if (i.customId === 'delete_inventory') {
            await i.deferUpdate();
            await messageReply.delete();
            collector.stop('deleted');
            return;
        }

        await i.deferUpdate();

        if (i.customId.startsWith('category_')) {
            // Switch from Category View to Card View
            currentCategory = i.customId.replace('category_', '');
            isCategoryView = false;
            currentPageIndex = 0;
            pageCount = await updateMessage(i);

        } else if (i.customId === 'back_to_category') {
            // Switch from Card View back to Category View
            isCategoryView = true;
            currentCategory = null;
            currentPageIndex = 0;
            await updateMessage(i);

        } else if (i.customId === 'prev_page' || i.customId === 'next_page') {
            // Pagination (only works in Card View)
            if (isCategoryView) return; 
            
            if (i.customId === 'prev_page') {
                currentPageIndex = Math.max(0, currentPageIndex - 1);
            } else if (i.customId === 'next_page') {
                currentPageIndex = Math.min(pageCount - 1, currentPageIndex + 1);
            }
            pageCount = await updateMessage(i);
        }
    });

    collector.on('end', async (collected, reason) => {
        if (reason === 'time') { 
            const result = isCategoryView 
                ? createCategoryEmbed(memberId, authorIsMember, dbObj)
                : createCardEmbed(memberId, currentCategory, currentPageIndex, dbObj);

            let componentsToDisable = result.rows || [result.row];
            if (!isCategoryView) componentsToDisable = [result.row]; 

            // Add delete button to the list if not present, for consistent disabling
            if (isCategoryView) {
                let lastRow = componentsToDisable[componentsToDisable.length - 1] || new ActionRowBuilder();
                if (!lastRow.components.some(c => c.customId === 'delete_inventory')) {
                    lastRow.addComponents(
                        new ButtonBuilder().setCustomId('delete_inventory').setLabel('❌').setStyle(ButtonStyle.Danger)
                    );
                }
                if (componentsToDisable.length === 0 || componentsToDisable[componentsToDisable.length - 1] !== lastRow) {
                    componentsToDisable.push(lastRow);
                }
            } else { // Card View
                 if (!componentsToDisable[0].components.some(c => c.customId === 'delete_inventory')) {
                    componentsToDisable[0].addComponents(
                        new ButtonBuilder().setCustomId('delete_inventory').setLabel('❌').setStyle(ButtonStyle.Danger)
                    );
                 }
            }
            
            const disabledComponents = componentsToDisable.map(row => 
                new ActionRowBuilder().addComponents(
                    row.components.map(component => 
                        ButtonBuilder.from(component).setDisabled(true)
                    )
                )
            );
            
            try {
                await messageReply.edit({ components: disabledComponents });
            } catch (error) {
                // Ignore message not found error
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