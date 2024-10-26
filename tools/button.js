const { Markup } = require('telegraf'); 

const clearKey = (ctx) => {

    const welcom = "Можете задавать вопрос!"

    ctx.reply(welcom, Markup.keyboard([
        ['Очистить диалог'],
      ])
      .resize());

};

const adminKey = (ctx) => {

  const welcom = "Админ панель"

  ctx.reply(welcom, Markup.keyboard([
      ['Рассылка'],
      ['Выйти']
    ])
    .resize());

};


let newsKey = (ctx, sms) => {

  const welcom = ` ✒️ | Вы уверены в отправке сообщения всем юзерам?\n\n✉️ | Сообщение: ${sms}`;

  const inlineKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('Отправить', 'sendSms')],
    [Markup.button.callback('Отменить', 'canselSms')]
  ]);

  ctx.reply(welcom, inlineKeyboard);

  

};



module.exports = {
clearKey,
adminKey, 
newsKey
}