const { Markup } = require('telegraf'); 

const clearKey = (ctx) => {

    const message = "Можете задавать вопрос!"

    ctx.reply(message, Markup.keyboard([
        ['Очистить диалог'],
      ])
      .resize());

};

const adminKey = (ctx) => {

  const message = "Админ панель"

  ctx.reply(message, Markup.keyboard([
      ['Рассылка'],
      ['Выйти']
    ])
    .resize());

};


let newsKey = (ctx, sms) => {

  const message = ` ✒️ | Вы уверены в отправке сообщения всем юзерам?\n\n✉️ | Сообщение: ${sms}`;

  const inlineKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('Отправить', 'sendSms')],
    [Markup.button.callback('Отменить', 'canselSms')]
  ]);

  ctx.reply(message, inlineKeyboard);

  

};



module.exports = {
clearKey,
adminKey, 
newsKey
}
