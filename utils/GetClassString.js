const CONSTANTS = require("../constants/constants");

function GetClassString (cardClass) {
    let cardClassString = "";
    let fillCount;
    if (cardClass <= CONSTANTS.RARE_CLASS_NUMBER) {
        for (fillCount = 0; fillCount < cardClass; fillCount++) {
            cardClassString += CONSTANTS.CLASS_SYMBOL_FILL;
        }

        for (fillCount; fillCount < CONSTANTS.RARE_CLASS_NUMBER; fillCount++) {
            cardClassString += CONSTANTS.CLASS_SYMBOL_OF_VOID;
        }
    }
    return cardClassString;
}

module.exports = GetClassString;