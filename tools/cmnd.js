const { message } = require('telegraf/filters');
const { saveUser } = require('../bd/bd'); 
const config = require('../config');

async function savenewUser(ctx, userId) {

    let chekUser = await saveUser(userId);

    if(saveUser === true) {

        let name = ctx.from.id;

       let sms = `Новый пользователь в боте | ${name}`;

        config.admins.forEach(adminId => { 
            ctx.telegram.sendMessage(adminId, sms)
        });

    }
};

async function chekAdmins(id, admins) {
    if (admins.includes(id)) {
        return true;
    } else {
        return false;
    };
};


module.exports = {
    savenewUser,
    chekAdmins
};
