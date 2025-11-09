const UserCheck = require("../utils/UserCheck.js");
const ReadDBFile = require("../utils/ReadDBFile.js");
const CONSTANTS = require("../constants/constants.js");
const SaveObjToDB = require("../utils/SaveObjToDB.js");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const GetClassString = require("../utils/GetClassString.js");
const ReplaceEmojisFromNameToClass = require("../utils/ClassFromName.js");
const ReturnRequeredUTCDateToReset = require("../utils/TimeDiff.js");
const LOCALES = require("../constants/locales.js");

// Assume configLocalTime is configured in CONSTANTS or available globally.
const configLocalTime = CONSTANTS.RESET_LOCAL_TIME; 
const COLLECTOR_TIMEOUT = 60000; // 60 seconds for re-roll button

// --- Utility Functions ---

function daysDiff(dt1, dt2) { 
    dt2 = new Date(dt2);
    let diffTime = Math.abs(dt2.getTime() - dt1.getTime());
    let daysDiff = diffTime / (1000 * 3600 * 24); 
    return daysDiff;
}

/**
 * Gets a random card, optionally filtered by class.
 * @param {Array<Object>} allCards - All cards from the database.
 * @param {string|null} targetClass - The class ID to limit the drop pool to ('1', '2', ..., 'nonstandard').
 * @returns {Object|null} The random card object.
 */
function GetRandomCard(allCards, targetClass = null) {
    let cardPool = allCards.filter(card => card.active);
    
    // Filter by class if a target class is provided (used for re-rolls)
    if (targetClass !== null) {
        const classNumber = parseInt(targetClass);
        if (!isNaN(classNumber) && targetClass !== 'nonstandard') {
             // Standard class (1-5)
             cardPool = cardPool.filter(card => card.class === classNumber);
        } else if (targetClass.toLowerCase() === 'nonstandard') {
             // Non-Standard class: filter cards where class is < 1 OR > 5
             cardPool = cardPool.filter(c => c.class < 1 || c.class > 5);
        }
    }
    
    if (cardPool.length === 0) return null;
    return cardPool[Math.floor(Math.random() * cardPool.length)];
}

// --- Card Handling Functions ---

/**
 * Handles the Amnesia event: 10% chance to remove 10 random cards if drop is blocked.
 * @returns {boolean} True if amnesia occurred.
 */
function handleAmnesia(userData, obj, message) {
    if (Math.random() < 0.10) { 
        if (userData.cards.length === 0) return false;

        const cardsToRemoveCount = Math.min(10, userData.cards.length);
        const removedCardNames = [];
        
        for (let i = 0; i < cardsToRemoveCount; i++) {
            const cardIndex = Math.floor(Math.random() * userData.cards.length);
            const cardItem = userData.cards[cardIndex];

            cardItem.count -= 1;
            removedCardNames.push(cardItem.name);

            if (cardItem.count <= 0) {
                 userData.cards.splice(cardIndex, 1);
            }
        }
        
        SaveObjToDB(obj);

        const cardList = removedCardNames.map(name => `\`${name}\``).join(', ');
        const embed = new EmbedBuilder()
            .setColor(0xcc0000)
            .setTitle(`😱 ${LOCALES.DropCard__AmnesiaTitle[CONSTANTS.LANG] || "AMNESIA STRIKES!"} 😱`)
            .setDescription(`${LOCALES.DropCard__AmnesiaMessage[CONSTANTS.LANG] || "You tried too hard to drop a card and suffered memory loss! The following cards were lost:"}`)
            .addFields({
                name: LOCALES.DropCard__AmnesiaLostCards[CONSTANTS.LANG] || "Lost Cards",
                value: cardList
            })
            .setFooter({ text: LOCALES.DropCard__AmnesiaBonusDrop[CONSTANTS.LANG] || "Due to the shock, you receive a bonus drop." }); 

        message.reply({ embeds: [embed] });
        return true;
    }
    return false;
}


/**
 * Core function to update user inventory with a new card.
 * Also sets the new 'rerollAvailable' flag on the user object.
 */
function updateInventory(userData, newCard) {
    let userCard = userData.cards.find(item => item.name === newCard.name);
    
    if (userCard) {
        userCard.count += 1;
    } else {
        userCard = {
            "name": newCard.name,
            "count": 1,
            "url": newCard.url
        };
        userData.cards.push(userCard);
    }

    const sameCardCount = userCard.count; 
    let reRollFlag = (sameCardCount > 0 && sameCardCount % 3 === 0);

    // NEW: Set flag on user data if a re-roll is earned
    if (reRollFlag) {
        userData.rerollAvailable = true;
    }

    return { sameCardCount, reRollFlag };
}

/**
 * Displays the dropped card and handles the re-roll button collector.
 */
async function showGivenCard(message, card, reRollFlag, obj, userData, client, isBonusDrop = false) {
    // Determine the card class number for the button ID
    let cardData = obj.cards.find(cardDB => cardDB.name === card.name);
    let cardClassNumber = cardData?.class;
    
    // Use 'nonstandard' string for ID if class is outside 1-5 (BASE CLASS)
    const rerollIdClass = (cardClassNumber >= 1 && cardClassNumber <= 5) ? cardClassNumber : 'nonstandard';
    
    let cardClassString = GetClassString(cardClassNumber);
    let sameCardCount = userData.cards.find(item => item.name === card.name)?.count || 1;
    
    const user = await client.users.fetch(message.author.id);
    
    const embed = new EmbedBuilder()
        .setColor(isBonusDrop ? "#33aaff" : "#d1b91f")
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() });

    let title;
    if (isBonusDrop) {
        // If it's a bonus drop, check if the user ran the command manually (rerollAvailable consumed) or via button (isReroll)
        // Note: The logic in handleCardDrop ensures isReroll is true if it was manually consumed.
        title = LOCALES.DropCard__MessageEmbed__got_bonus_card[CONSTANTS.LANG] || "You got a bonus drop:";
    } else {
        title = LOCALES.DropCard__MessageEmbed__got_card_with_name[CONSTANTS.LANG] || "You got a card named:";
    }
    
    embed.setTitle(title); 
    embed.setDescription(`**${(cardClassString) ? cardClassString : ReplaceEmojisFromNameToClass(card)} [${card.name}](${card.url})**`);
    embed.setImage(`${card.url}`);
    embed.setFooter({ text: `${LOCALES.DropCard__MessageEmbed__cards_you_have_now[CONSTANTS.LANG]} ${sameCardCount}` });

    let components = [];

    if (reRollFlag) {
        embed.addFields({ name: `✨ ${LOCALES.DropCard__MessageEmbed__3_cards_in_a_row1[CONSTANTS.LANG] || "Bonus Drop!"}`, 
                          value: `${LOCALES.DropCard__MessageEmbed__3_cards_in_a_row2[CONSTANTS.LANG] || "You get a free re-roll. Click the button below or call the drop command again!"}`, 
                          inline: false 
                        });
        
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                // Embed the class ID (e.g., 'reroll_3' or 'reroll_nonstandard')
                .setCustomId(`reroll_${rerollIdClass}`) 
                .setLabel(LOCALES.DropCard__RerollButton[CONSTANTS.LANG] || 'Reroll Card')
                .setStyle(ButtonStyle.Success)
                .setDisabled(false)
        );
        components.push(row);
    }

    const messageReply = await message.reply({ embeds: [embed], components: components });
    
    // Start collector if reRollFlag is set
    if (reRollFlag) {
        const row = components[0]; 
        const filter = (i) => i.customId.startsWith('reroll_') && i.user.id === message.author.id;
        const collector = messageReply.createMessageComponentCollector({ filter, time: COLLECTOR_TIMEOUT, componentType: ComponentType.Button });

        collector.on('collect', async i => {
            await i.deferUpdate();
            collector.stop('reroll_used');
            
            // Consume the flag if the button is used instead of the command
            userData.rerollAvailable = false;
            SaveObjToDB(obj);
            
            // Extract the class ID (e.g., '3' or 'nonstandard')
            const rerollClass = i.customId.split('_')[1]; 
            
            // Perform the re-roll logic (isReroll=true, isAmnesiaBonus=false)
            await handleCardDrop(message, obj, client, true, false, rerollClass); 

            // Disable the re-roll button on the original message
            const disabledRow = new ActionRowBuilder().addComponents(
                ButtonBuilder.from(row.components[0]).setDisabled(true).setLabel(`${LOCALES.DropCard__RerollUsed[CONSTANTS.LANG] || 'Reroll Used'}`)
            );
            await messageReply.edit({ components: [disabledRow] }).catch(() => {});
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time' && messageReply.editable) {
                // If the user used the command instead of the button, the flag is already false.
                // If the user did nothing, the flag is still true, and we should keep the button active.
                // If we disable the button after timeout, we should clear the flag.
                 if (userData.rerollAvailable) {
                     userData.rerollAvailable = false;
                     SaveObjToDB(obj);
                 }
                 const disabledRow = new ActionRowBuilder().addComponents(
                    ButtonBuilder.from(components[0].components[0]).setDisabled(true).setLabel(`${LOCALES.DropCard__RerollExpired[CONSTANTS.LANG] || 'Reroll Expired'}`)
                );
                await messageReply.edit({ components: [disabledRow] }).catch(() => {});
            }
        });
    }
}

/**
 * Handles the actual card dropping, timing, and database update.
 * @param {boolean} isReroll - True if this drop is triggered by the re-roll button (DOES NOT reset timer).
 * @param {boolean} isAmnesiaBonus - True if this drop is triggered by the amnesia event (RESETS timer).
 * @param {string|null} rerollClass - The class ID to limit the drop pool to during a re-roll.
 */
async function handleCardDrop(message, obj, client, isReroll = false, isAmnesiaBonus = false, rerollClass = null) {
    const userData = obj.users.find(i => i.id === message.author.id);
    if (!userData) {
         return message.reply("Error: User data not found. Please try again.");
    }
    
    // Drop is allowed if: it's a button re-roll, amnesia bonus, OR the 'rerollAvailable' flag is set.
    let canDrop = isReroll || isAmnesiaBonus || userData.rerollAvailable; 
    let remainingTimeMessage = null;

    // Check cooldown ONLY if not a bonus drop
    if (!canDrop) { 
        if (userData.lastDropDate === null) {
            canDrop = true;
        } else {
            const lastDropDate = new Date(userData.lastDropDate);
            
            if (!(configLocalTime[0]) && daysDiff(new Date(), lastDropDate) >= 1) {
                canDrop = true;
            } else if (configLocalTime[0] && new Date() >= ReturnRequeredUTCDateToReset()) {
                canDrop = true;
            } else {
                // Cooldown calculation
                let resetTime = (!(configLocalTime[0]) ? new Date(lastDropDate.getTime() + 24 * 3600000) : ReturnRequeredUTCDateToReset());
                let remainingTime = resetTime - Date.now();
                
                let remainingHours = Math.floor(remainingTime / 3600000);
                remainingTime -= remainingHours * 3600000;
                let remainingMinutes = Math.floor(remainingTime / 60000);
                remainingTime -= remainingMinutes * 60000;
                let remainingSecs = Math.floor(remainingTime / 1000);
                
                remainingTimeMessage = `${LOCALES.DropCard__MessageEmbed__cant_get_more_now[CONSTANTS.LANG]} ${remainingHours}${LOCALES.DropCard__MessageEmbed__hours[CONSTANTS.LANG]} ${remainingMinutes }${LOCALES.DropCard__MessageEmbed__min[CONSTANTS.LANG]} ${remainingSecs }${LOCALES.DropCard__MessageEmbed__sec[CONSTANTS.LANG]}`;
            }
        }
    }

    if (canDrop) {
        // NEW: If the manual drop is consuming the 'rerollAvailable' flag, treat it as a bonus re-roll.
        if (userData.rerollAvailable) {
            userData.rerollAvailable = false;
            // Set isReroll to true for display purposes, but don't reset the timer below.
            isReroll = true; 
            // The class must be defined here if the user ran the command *without* the button.
            // Since we don't know the class of the triggering card, we must force a random card here, 
            // OR store the class of the card that granted the reroll.
            // For simplicity, we will assume if manual call, rerollClass is null for a full random reroll.
        }
        
        const rCard = GetRandomCard(obj.cards, rerollClass); 
        
        if (!rCard) {
            if (isReroll) {
                return message.reply(`There are no other active cards of the same rarity to re-roll into.`);
            }
            return message.reply("Error: No active cards available to drop.");
        }

        // 1. Update Inventory and get results (This updates 'rerollAvailable' if a new reroll is earned)
        const { reRollFlag } = updateInventory(userData, rCard);

        // 2. Update Drop Date:
        // Timer resets only if it was a standard drop OR the Amnesia bonus drop.
        // It should NOT reset for a button-triggered drop (isReroll) or a manual drop consuming the free turn.
        if (!isReroll) {
             userData.lastDropDate = new Date();
        } 

        // 3. Save, Show, and Process re-roll
        SaveObjToDB(obj);
        await showGivenCard(message, rCard, reRollFlag, obj, userData, client, isReroll || isAmnesiaBonus);
        
    } else {
        // Drop is blocked (Cooldown)
        if (!isReroll) {
            const amnesiaOccurred = handleAmnesia(userData, obj, message);
            
            if (amnesiaOccurred) {
                // Amnesia occurred: grant a bonus drop and reset the timer.
                await handleCardDrop(message, obj, client, false, true); 
                return; 
            }
            
            if (!amnesiaOccurred) {
                // No Amnesia: show the cooldown message.
                message.reply(remainingTimeMessage);
            }
        }
    }
}


const DropCard = (message, args, client) => {
    UserCheck(message.author.id);
    let obj = ReadDBFile();
    if (!obj) return;
    
    const userData = obj.users.find(i => i.id === message.author.id);
    if (!userData) {
        return; 
    }
    
    // Call the main logic handler (Standard drop attempt)
    // Note: Since this is the initial call, isReroll and isAmnesiaBonus are false, and rerollClass is null.
    handleCardDrop(message, obj, client, false, false);
};

module.exports = {
    name: LOCALES.DropCard__EXPORTS__name[CONSTANTS.LANG], 
    usage() { return `${CONSTANTS.PREFIX}${this.name}`; },
    desc: LOCALES.DropCard__EXPORTS__desc[CONSTANTS.LANG], 
    func: DropCard,
};