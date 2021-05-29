const RegisterUser = require('./RegisterUser.js');
const ReadDBFile = require("./ReadDBFile.js");
const UserMemberCheck = (user) => {
    let obj = ReadDBFile();

    if (obj.users != undefined && obj.users.length > 0) {
        let finded = false;
        for (let i of obj.users ) {
            if(i.id == user.id) {
                finded = true;
                return;
            }
        }
        if (!finded) RegisterUser(user);
    } else {
        RegisterUser(user);
    }
};
module.exports = UserMemberCheck;
  