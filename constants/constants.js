require('dotenv').config();
const INVENTORY_TIME = process.env.INVENTORY_TIME;
const CLASS_SYMBOL_FILL = process.env.CLASS_SYMBOL_FILL;
const CLASS_SYMBOL_OF_VOID = process.env.CLASS_SYMBOL_OF_VOID;
const RARE_CLASS_NUMBER = process.env.RARE_CLASS_NUMBER;
const PAGE_SIZE = process.env.PAGE_SIZE;
const PREFIX = process.env.PREFIX;
const TOKEN = process.env.TOKEN;
const INVENTORY_PUBLIC_ACCESS = parseInt(process.env.INVENTORY_PUBLIC_ACCESS);
module.exports = {
    INVENTORY_TIME,
    CLASS_SYMBOL_FILL,
    CLASS_SYMBOL_OF_VOID,
    RARE_CLASS_NUMBER,
    PAGE_SIZE,
    PREFIX,
    INVENTORY_PUBLIC_ACCESS,
    TOKEN
}