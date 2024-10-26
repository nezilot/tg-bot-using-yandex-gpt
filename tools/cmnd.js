const { message } = require('telegraf/filters');
const { saveUser } = require('../bd/bd'); 

async function savenewUser(ctx, userId) {

    let chekUser = await saveUser(userId);

    if(saveUser === true) {

        let name = ctx.from.id;

       let sms = `Новый пользователь в боте | ${name}`;

       ctx.telegram.sendMessage(7209442833, sms);

    }
    else {

        return;

    }


};

async function chekAdmins(id, admins) {


if (admins.includes(id)) {


    console.log('пытался и получилось: ', id);

    return true;

} else {

    console.log('пытался и не получилось: ', id);

    return false;

};


};


module.exports = {
    savenewUser,
    chekAdmins
};