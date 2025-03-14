const { Scenes } = require('telegraf');
const { chekAdmins } = require('./cmnd');
const config = require('../config');
const { askAi } = require('./gpt');
const { parseUsers} = require('../bd/bd');
const { clearKey, adminKey, newsKey } = require('./button');

let mainScene = new Scenes.BaseScene('mainScene');

mainScene.enter((ctx) => {

  clearKey(ctx);

});

mainScene.on('text', async (ctx) => {
    

    let userMessage = ctx.message.text;

    switch(userMessage) {

      case '/start':

      ctx.reply('Вы уже можеете задавать вопрос');

      break;

      case '/admin':

      let id = ctx.from.id;
      let admins = config.admins;
  
      
      const checkedAdmins = await chekAdmins(id, admins);
  
      if (checkedAdmins === true) {

          ctx.scene.enter('adminScene');

      } else {
          ctx.reply('У вас нет доступа!');
      };

      break;

      case 'Очистить диалог':

      askAi(ctx, userMessage);

      break;

      default: 

      ctx.reply('Думаю над ответом...').then((msg) => {

        ctx.session.deleteChannelMsgId = msg.message_id;

    });

      askAi(ctx, userMessage)
  
    .then(response => {

      if( ctx.session.deleteChannelMsgId === null) {

        return;

      } 
      {
        ctx.deleteMessage(ctx.session.deleteChannelMsgId);

        ctx.session.deleteChannelMsgId = null;

      }
  
      setTimeout(() => {
  
          ctx.scene.enter('mainScene');
  
      }, 1500);
  
    }).catch(error => {
  
      ctx.reply('Произошел какой то баг... Перезапуск');
  
      setTimeout(() => {
          ctx.scene.enter('mainScene');
      }, 1500);
  
  
      console.error(error);
    });
  

      break;

    };


});

let adminScene = new Scenes.BaseScene('adminScene');

adminScene.enter((ctx) => {

  adminKey(ctx);

});

adminScene.on('text', (ctx) => {

  let userMessage = ctx.message.text;

  switch(userMessage) {

    case 'Рассылка':

      ctx.scene.enter('tgNews');

      break;

      case 'Выйти': 

      ctx.scene.enter('mainScene');

      break;

}});

let tgNews = new Scenes.BaseScene('tgNews');

tgNews.enter((ctx) => {

  let sms = null;

  ctx.reply('✒️ | Введите сообщение для рассылки: ');
  
  
  tgNews.on('message', async (ctx) => {
    try {
      
      if(sms === null) {
  
      sms = ctx.message.text;
  
      newsKey(ctx, sms);
  
      tgNews.action('sendSms', async (ctx) => {
      
        let allId = await parseUsers();
      
        ctx.deleteMessage();
  
    for (let userId of allId) {
          try {

            await ctx.telegram.sendMessage(userId, sms);
  
          } catch (err) {
            console.error(`Ошибка при отправке сообщения пользователю ${userId}: ${err}`);
          }
        }
  
        ctx.reply('Рассылка заверешена')
  
        setTimeout(() => {
  
          sms = null;
  
          ctx.scene.enter('adminScene');
  
        }, 1000)
      });
  
      tgNews.action('canselSms', async (ctx) => {
  
        ctx.deleteMessage();
  
        sms = null;
  
        ctx.scene.enter('adminScene');
  
  
      });
  
      } 
               
  
    }catch(err) {}
  
    })

});

module.exports = {
    mainScene,
    adminScene,
    tgNews
}
