const ReadDBFile = require("./ReadDBFile.js");
const SaveObjToDB = require("./SaveObjToDB.js");
const LOCALES = require("../constants/locales.js");
const CONSTANTS = require("../constants/constants.js");
    /* User db.json reference
    User {
        users: [
            {
                id: Discord_id,
                cards:
                [
                    {
                        name: String,
                        count: Number,
                        url: String
                    }
                ],
                lastDropDate : Date
            }
        ]

    }
    */

const RegisterUser = (user, dbObj = ReadDBFile()) => {
    if(!dbObj) return;
    dbObj.users.push(
        {
            id: user,
            cards: [],
            lastDropDate: null
        }
    )
    SaveObjToDB(dbObj);
    console.log(`${user} ${LOCALES.RegisterUser__MessageEmbed_registered[CONSTANTS.LANG]}`)
}

module.exports = RegisterUser;