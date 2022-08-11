const RegisterUser = require('./RegisterUser.js');
const ReadDBFile = require("./ReadDBFile.js");
const CONSTANTS = require ("../constants/constants.js");
const LOCALES = require('../constants/locales.js');
const UserMemberCheck = (user) => {
	let obj = ReadDBFile();
	console.log(user);
	if (obj.users) { // if DB file exist
		let finded = false;
		for (let i of obj.users ) {
			if(i.id == user) {
				finded = true;
				return i;
			}
		}
		/*if (!finded)*/
		RegisterUser(user, obj);
		return false;
	} else {
		console.error(LOCALES.UserCheck__MessageEmbed_db_error[CONSTANTS.LANG]);
		return false;
	}
};
module.exports = UserMemberCheck;
  