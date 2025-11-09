const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const CONSTANTS = require ("../constants/constants.js");
const SaveObjToDB = require("../utils/SaveObjToDB.js"); 
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

/**
 * FIXED: Removes all Unicode emojis, custom Discord emojis, and common Discord text shortcuts from a string.
 */
function stripEmojis(str) {
    // 1. Explicitly remove common Discord text shortcuts that render as emojis
    let cleanedStr = str.replace(/:six_pointed_star:/g, '');
    cleanedStr = cleanedStr.replace(/:skull:/g, '');
    
    // 2. Custom Discord Emojis (e.g., <a:name:id> or <:name:id>)
    const discordCustomRegex = /<a?:\w+:\d+>/g;
    cleanedStr = cleanedStr.replace(discordCustomRegex, '');

    // 3. Unicode Emojis (standard and complex)
    const unicodeRegex = /([\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]|[\u{1F1E6}-\u{1F1FF}]{2})/gu;
    cleanedStr = cleanedStr.replace(unicodeRegex, '').trim();
    
    // 4. Remove the extra text that sometimes accompanies the emojis in your card names
    cleanedStr = cleanedStr.replace(/six_pointed_star/g, ''); 
    cleanedStr = cleanedStr.replace(/skull/g, '');
    cleanedStr = cleanedStr.replace(/📖/g, '');
    cleanedStr = cleanedStr.replace(/🏳️‍🌈/g, '');
    
    return cleanedStr.trim();
}

function GetUserCards(userId) {
    let obj = ReadDBFile();
    // Assuming obj.users[].cards is an array of objects: [{ name: 'Card Name', count: N, url: '...' }]
    return obj.users.find(user => userId == user.id)?.cards || [];
}

/**
 * FIXED: Gets user cards and details them with class, URL, and a unique ID (index in dbObj.cards).
 * Ensures URL is always pulled from the master DB if not present in user inventory for video checks.
 * If a card is not found in the master DB, it is assigned class 0 (Non-Standard).
 */
function getDetailedUserCards(userCards, dbObj) {
    return userCards.map(userCard => {
        // Find the index in the master list for a unique ID
        const dbCardIndex = dbObj.cards.findIndex(cardDB => cardDB.name == userCard.name);
        const dbCard = dbObj.cards[dbCardIndex]; 
        
        const cardClassNumber = dbCard ? dbCard.class : 0;
        // Assuming GetClassString is implemented to handle 0/nonstandard classes
        const cardClassString = GetClassString(cardClassNumber); 

        // Explicitly use the URL from the user card, but fall back to the master DB card URL
        const cardUrl = userCard.url || (dbCard ? dbCard.url : null);
        
        return {
            ...userCard,
            uniqueId: dbCardIndex, // The unique numerical ID of the card TYPE in the master DB
            class: cardClassNumber,
            classString: cardClassString,
            dbCard: dbCard,
            url: cardUrl // Guaranteed URL
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
        const totalInClass = dbObj.cards.filter(c => c.class == cardClass).length;
        // FIX: Ensure detailedCards are filtered correctly by class
        const userInClass = detailedCards.filter(c => c.class == cardClass).length;
        
        const classStringForEmbed = GetClassString(cardClass); 
        const buttonEmoji = GetButtonEmoji(cardClass); 
        const rarityName = GetRarityName(cardClass); 
        
        const classButtonLabel = `${rarityName} (${userInClass})`; 
        
        fieldContent += `${classStringForEmbed}: **${userInClass} / ${totalInClass}**\n`;

        const classButton = new ButtonBuilder()
            .setCustomId(`category_${cardClass}`)
            .setLabel(classButtonLabel)
            .setEmoji(buttonEmoji) 
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(userInClass == 0);
        
        currentRow.addComponents(classButton);
        
        if (currentRow.components.length == 5) { 
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
    
    if (totalNonStandard > 0 || userNonStandard > 0) { // FIX: Show non-standard if user HAS one, even if master DB doesn't list it
        fieldContent += `\n${NON_STANDARD_EMOJI} ${NON_STANDARD_LABEL}: **${userNonStandard} / ${totalNonStandard}**\n`;

        const nonStandardButton = new ButtonBuilder()
            .setCustomId('category_nonstandard')
            .setLabel(`${NON_STANDARD_LABEL} (${userNonStandard})`) 
            .setEmoji(NON_STANDARD_EMOJI) 
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(userNonStandard == 0);

        currentRow.addComponents(nonStandardButton);
    }

    // Push the final row (containing non-standard button if applicable)
    if (currentRow.components.length > 0) {
        buttonRows.push(currentRow);
    }

    embed.setDescription(fieldContent);
    embed.addFields({
        name: `**${LOCALES.ShowCards__MessageEmbed__total[CONSTANTS.LANG]}:**`,
        value: `**${detailedCards.length} / ${totalCardCount}**` // Use detailedCards.length for total unique cards owned
    });
    
    return { embed, rows: buttonRows };
}

// --- Card Viewer Renderer ---

/**
 * Creates the Embed and ActionRow for the Single Card Viewer.
 * @param {Object} card - The detailed card object (from getDetailedUserCards).
 * @param {string} classId - The current class ID (e.g., '3' or 'nonstandard') to pass back.
 * @param {number} pageIndex - The current page index to pass back.
 */
function createCardViewerEmbed(card, classId, pageIndex) {
    const embed = new EmbedBuilder()
        .setColor(0x0f3961)
        .setTitle(`${LOCALES.ShowCards__CardView[CONSTANTS.LANG]}: ${card.name}`) // Shows full name including emojis
        .setDescription(`**${card.classString || ReplaceEmojisFromNameToClass(card)} (x${card.count})**`);

    let videoLink = null;
    const urlLower = card.url ? card.url.toLowerCase() : '';
    
    // Check if it's a video file (.mp4)
    const isVideo = urlLower.endsWith('.mp4');

    if (isVideo) {
        // Prepare the video link for the second message
        videoLink = card.url;
        
        embed.addFields({ 
            name: `🎥 ${LOCALES.ShowCards__VideoCardViewer[CONSTANTS.LANG]}`, 
            value: `${LOCALES.ShowCards__VideoCardViewerBelow[CONSTANTS.LANG]}`, 
            inline: false 
        });
        embed.setImage(null); // Explicitly remove any placeholder image
    } else {
        // Standard image or GIF display (Discord handles GIFs in the embed image field)
        embed.setImage(`${card.url}`);
    }

    // Navigation buttons: Back to List View (of the class) and Delete
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`back_to_card_list_${classId}_${pageIndex}`) // Back button includes state
            .setLabel('List ↩️')
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder() 
            .setCustomId('delete_inventory')
            .setLabel('❌')
            .setStyle(ButtonStyle.Danger)
    );
    
    return { embed, row, videoLink };
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

    if (cardClass == 'nonstandard') {
        filteredCards = detailedCards.filter(c => c.class < 1 || c.class > 5);
        className = "Non-Standard Cards";
    } else {
        const classNumber = parseInt(cardClass);
        filteredCards = detailedCards.filter(c => c.class == classNumber);
        className = GetClassString(classNumber);
    }
    
    // FIX: Ensure filteredCards contains only UNIQUE card types (by uniqueId/index)
    const uniqueCardsMap = new Map();
    filteredCards.forEach(card => {
        // Use uniqueId (index in dbObj.cards) as the key to guarantee uniqueness by card TYPE
        uniqueCardsMap.set(card.uniqueId, card); 
    });
    filteredCards = Array.from(uniqueCardsMap.values());
    
    const pageCount = Math.ceil(filteredCards.length / CONSTANTS.PAGE_SIZE);
    
    if(filteredCards.length == 0) {
        return { 
            embed: new EmbedBuilder().setDescription(`No cards found in category: ${className}`),
            rows: [new ActionRowBuilder()],
            pageCount: 0
        };
    }
    
    const start = CONSTANTS.PAGE_SIZE * pageIndex;
    const end = CONSTANTS.PAGE_SIZE * (pageIndex + 1);
    
    const embed = new EmbedBuilder()
        .setColor(0x0f3961)
        .setTitle(`${LOCALES.ShowCards__MessageEmbed__category[CONSTANTS.LANG]}: ${className}`);
    
    // --- UPDATED: Use components for each card on the page ---
    let cardButtonsRows = [];
    let currentCardRow = new ActionRowBuilder();
    
    const cardsOnPage = filteredCards.slice(start, end);
    embed.addFields({
        name: `${LOCALES.ShowCards__BTN_info[CONSTANTS.LANG]}:`,
        value: '--------------------------------------',
        inline: false
    });

    cardsOnPage.forEach((card, index) => {
        // Apply FIX: Strip emojis (Unicode, Custom Discord, and text shortcuts) for the button label only
        const cleanedName = stripEmojis(card.name);
        
        // Determine if it's a video card to add an indicator
        const isVideo = card.url && card.url.toLowerCase().endsWith('.mp4');
        const videoIndicator = isVideo ? ' 🎥' : ''; 

        // Use a truncated name for the button label if too long
        const cardLabel = `${cleanedName.substring(0, 27)}${(cleanedName.length > 27 ? '...' : '')}${videoIndicator} (x${card.count})`;
        const cardButton = new ButtonBuilder()
            // Use the unique ID (index in the master list) for the custom ID
            .setCustomId(`view_card_id_${card.uniqueId}`) 
            .setLabel(cardLabel)
            .setStyle(ButtonStyle.Secondary);
            
        currentCardRow.addComponents(cardButton);
        
        // 3 buttons per row limit
        if (currentCardRow.components.length == 3 || index == cardsOnPage.length - 1) { 
            cardButtonsRows.push(currentCardRow);
            currentCardRow = new ActionRowBuilder();
        }
    });

    // Footer
    embed.addFields({
        name: `** ${LOCALES.ShowCards__MessageEmbed__page[CONSTANTS.LANG]} ${pageIndex + 1 } / ${pageCount}**`, 
        value: `** **`
    });

    // Create Navigation Buttons (Prev, Next, Back)
    const navRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('prev_page')
            .setLabel('⬅️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(pageIndex == 0),
        new ButtonBuilder()
            .setCustomId('next_page')
            .setLabel('➡️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(pageIndex == pageCount - 1),
        new ButtonBuilder() // Back Button
            .setCustomId('back_to_category')
            .setLabel('Categories ↩️')
            .setStyle(ButtonStyle.Success)
    );
    
    // Combine card button rows and navigation row
    const allRows = [...cardButtonsRows, navRow];
    
    return { embed, rows: allRows, pageCount }; 
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

    const authorIsMember = memberId == message.author.id;
    
    UserCheck(memberId);
    
    if (!CONSTANTS.INVENTORY_PUBLIC_ACCESS && memberId !== message.author.id) {
        message.reply({ content: `${LOCALES.ShowCards__MessageEmbed__access_denied[CONSTANTS.LANG]}` });
        return;
    }
    
    const userCards = GetUserCards(memberId);
    if (userCards.length == 0) {
        message.reply({ 
            content: `${ (args[0])?`${LOCALES.ShowCards__MessageEmbed__no_cards2[CONSTANTS.LANG]}`:`${LOCALES.ShowCards__MessageEmbed__no_cards3[CONSTANTS.LANG]}`} ${LOCALES.ShowCards__MessageEmbed__no_cards4[CONSTANTS.LANG]}`
        });
        return;
    }
    
    // 2. State Variables
    const dbObj = ReadDBFile();
    let currentPageIndex = 0; 
    let isCategoryView = true;
    let isCardViewer = false; 
    let currentCategory = null; 
    let currentCardName = null; 
    let pageCount = 0;
    let videoMessageId = null; // To track the separate video link message ID

    // Function to delete the previously sent video link message
    const cleanupVideoMessage = async (channel) => {
        if (videoMessageId) {
            try {
                const videoMessage = await channel.messages.fetch(videoMessageId);
                await videoMessage.delete();
            } catch (error) {
                // Ignore errors if the message was already deleted or not found
            }
            videoMessageId = null; // Clear the stored ID after attempting to delete
        }
    };

    // 3. Update Message Function
    const updateMessage = async (interaction) => {
        let newEmbed;
        let newComponents = [];

        // IMPORTANT: Cleanup must happen before the main message update
        if (interaction && interaction.channel) {
            await cleanupVideoMessage(interaction.channel); 
        }
        
        if (isCategoryView) {
            const result = createCategoryEmbed(memberId, authorIsMember, dbObj);
            newEmbed = result.embed;
            newComponents = result.rows;
            pageCount = 0; 
            
            // Ensure the Delete button is appended to the last row
            let lastRow = newComponents[newComponents.length - 1] || new ActionRowBuilder();
            
            if (!lastRow.components.some(c => c.customId == 'delete_inventory')) {
                 lastRow.addComponents(
                     new ButtonBuilder()
                         .setCustomId('delete_inventory')
                         .setLabel('❌')
                         .setStyle(ButtonStyle.Danger)
                 );
            }
            if (newComponents.length == 0 || newComponents[newComponents.length - 1] !== lastRow) {
                newComponents.push(lastRow);
            }

        } else if (isCardViewer) {
            // Find the card detail using the name (this is reliable since names are unique)
            const cardDetail = getDetailedUserCards(GetUserCards(memberId), dbObj).find(c => c.name == currentCardName);
            // Safety check: if cardDetail is null, go back to category view
            if (!cardDetail) {
                 isCategoryView = true;
                 isCardViewer = false;
                 return updateMessage(interaction);
            }
            
            const result = createCardViewerEmbed(cardDetail, currentCategory, currentPageIndex);
            
            newEmbed = result.embed;
            newComponents = [result.row];
            
        } else {
            // Card List View (Pagination View)
            const result = createCardEmbed(memberId, currentCategory, currentPageIndex, dbObj);
            newEmbed = result.embed;
            
            // Get all rows from the card embed, then append the delete button to the last row
            const cardRows = result.rows;
            let lastRow = cardRows[cardRows.length - 1] || new ActionRowBuilder();

            // Ensure the Delete button is appended to the last row of the card list view
            if (!lastRow.components.some(c => c.customId == 'delete_inventory')) {
                 lastRow.addComponents(
                     new ButtonBuilder()
                         .setCustomId('delete_inventory')
                         .setLabel('❌')
                         .setStyle(ButtonStyle.Danger)
                 );
            }
            // Ensure the modified last row is in the components array
            newComponents = cardRows;
            pageCount = result.pageCount;
        }

        newEmbed.setAuthor({
            name: message.author.username, 
            iconURL: message.author.displayAvatarURL()
        });

        const editOptions = {
            embeds: [newEmbed],
            components: newComponents,
            // Ensure no content is sent here to prevent accidental video player overlap
            content: '' 
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
            if (i.user.id == message.author.id) return true; 

            if (i.customId == 'delete_inventory' && i.guild) {
                const member = await i.guild.members.fetch(i.user.id);
                if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return true;
            }
            await i.reply({ content: `${LOCALES.ShowCards__PermissionMessage[CONSTANTS.LANG]}`, ephemeral: true });
            return false;
        }, 
        time: CONSTANTS.INVENTORY_TIME 
    });

    collector.on('collect', async i => {
        
        // RESET TIMER: Extend the collector's life on every interaction
        collector.resetTimer();

        // Handle delete button first (stops collector)
        if (i.customId == 'delete_inventory') {
            await i.deferUpdate();
            await cleanupVideoMessage(i.channel); // Cleanup video message on delete
            await messageReply.delete();
            collector.stop('deleted');
            return;
        }

        // Always defer update before state change
        await i.deferUpdate();

        let shouldUpdateMainMessage = true;
        
        // --- State/View Transitions ---
        
        if (i.customId.startsWith('category_')) {
            // Switch from Category View to Card List View
            currentCategory = i.customId.replace('category_', '');
            isCategoryView = false;
            isCardViewer = false;
            currentPageIndex = 0;
            currentCardName = null;
            
        } else if (i.customId == 'back_to_category') {
            // Switch from Card List View back to Category View
            isCategoryView = true;
            isCardViewer = false;
            currentCategory = null;
            currentPageIndex = 0;
            currentCardName = null;
            
        } else if (i.customId.startsWith('view_card_id_')) { 
            // Switch to Card Viewer
            
            // 1. Extract the ID and find the full name
            const uniqueId = parseInt(i.customId.replace('view_card_id_', '')); 
            const cardData = dbObj.cards[uniqueId];
            
            if (!cardData) return; // Safety check if ID is invalid

            currentCardName = cardData.name; // Set the state using the actual name
            isCategoryView = false;
            isCardViewer = true;
            
            // 2. Update the main message to the Card Viewer Embed (calls cleanup inside updateMessage)
            pageCount = await updateMessage(i); 

            // 3. Send video link in a separate message IF applicable
            // We need to re-fetch detailed card data based on the current user's inventory
            const cardDetail = getDetailedUserCards(GetUserCards(memberId), dbObj).find(c => c.name == currentCardName);
            const viewerResult = createCardViewerEmbed(cardDetail, currentCategory, currentPageIndex);
            
            if (viewerResult.videoLink) {
                // Send the video link and store its ID
                const videoMessage = await i.channel.send(viewerResult.videoLink);
                videoMessageId = videoMessage.id;
            }

            shouldUpdateMainMessage = false; // Message was already updated/edited

        } else if (i.customId.startsWith('back_to_card_list_')) { 
            // Switch back from Card Viewer to Card List View
            const parts = i.customId.split('_'); 
            currentCategory = parts[4];
            currentPageIndex = parseInt(parts[5]);
            
            isCategoryView = false;
            isCardViewer = false;
            currentCardName = null;
            
        } else if (i.customId == 'prev_page' || i.customId == 'next_page') {
            // Pagination (only works in Card List View)
            if (isCategoryView || isCardViewer) return; 
            
            if (i.customId == 'prev_page') {
                currentPageIndex = Math.max(0, currentPageIndex - 1);
            } else if (i.customId == 'next_page') {
                currentPageIndex = Math.min(pageCount - 1, currentPageIndex + 1);
            }
        }
        
        // --- Message Update ---
        if (shouldUpdateMainMessage) {
            // This implicitly calls cleanupVideoMessage inside updateMessage(i)
            pageCount = await updateMessage(i); 
        }
    });

    collector.on('end', async (collected, reason) => {
        if (reason == 'time') { 
            // Always attempt cleanup on timeout
            await cleanupVideoMessage(messageReply.channel); 
            
            // Determine the final set of components to disable
            let componentsToDisable = [];

            if (isCategoryView) {
                const result = createCategoryEmbed(memberId, authorIsMember, dbObj);
                componentsToDisable = result.rows;
            } else if (!isCardViewer) { // Card List View
                const result = createCardEmbed(memberId, currentCategory, currentPageIndex, dbObj);
                componentsToDisable = result.rows;
            } else { // Card Viewer
                const cardDetail = getDetailedUserCards(GetUserCards(memberId), dbObj).find(c => c.name == currentCardName);
                if (cardDetail) {
                    const result = createCardViewerEmbed(cardDetail, currentCategory, currentPageIndex);
                    componentsToDisable = [result.row];
                }
            }
            
            // Ensure the Delete button is present in the final row for disabling if it wasn't already added 
            // (Only for Category and List views, Viewer already has it)
            if (componentsToDisable.length > 0 && !isCardViewer) {
                let lastRow = componentsToDisable[componentsToDisable.length - 1];
                 if (!lastRow.components.some(c => c.customId == 'delete_inventory')) {
                    lastRow.addComponents(new ButtonBuilder().setCustomId('delete_inventory').setLabel('❌').setStyle(ButtonStyle.Danger));
                }
            }
            
            // Map components to disabled state
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