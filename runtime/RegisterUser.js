const fs = require('fs');
const ReadDBFile = require("./ReadDBFile.js");

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

const RegisterUser = (user) => {
    let obj = ReadDBFile();
    if(!obj) return;
    obj.users.push(
        {
            id: user.id,
            cards: [],
            lastDropDate: null
        }
    )
    let json = JSON.stringify(obj, null, "\t");
    fs.writeFileSync('./storage/db.json', json, 'utf8');
}

module.exports = RegisterUser;