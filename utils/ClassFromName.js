function replaceEmojisFromNameToClass(card) {
    let regexp = new RegExp(/(<a?)?:\w+:(\d{18}>)?/g);
    let result = [...card.name.matchAll(regexp)];
    let cardClassString = "";
    if(result.length) {
        for (let match of result) {
            cardClassString+= match;
        }
        cardClassString = cardClassString.replace(/,/g, "");
        card.name = card.name.replace(regexp, "" );
        return cardClassString;
    }
    return cardClassString;
}

module.exports = replaceEmojisFromNameToClass