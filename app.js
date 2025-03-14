const { Telegraf, Scenes} = require('telegraf');
const { session } = require('telegraf/session');
const config = require('./config');
const { savenewUser, chekAdmins } = require('./tools/cmnd');
const { mainScene, adminScene, tgNews } = require('./tools/scenes');

const gpt = new Telegraf(config.token);

let stage = new Scenes.Stage([mainScene, adminScene, tgNews]);

gpt.use(session());

gpt.use(stage.middleware());

gpt.use((ctx, next) => {

    if (!ctx.session) ctx.session = {};
    
    return next();
  });


  gpt.command('admin', async (ctx) => {
    let id = ctx.from.id;
    let admins = config.admins;

    

    const checkedAdmins = await chekAdmins(id, admins);

    if (checkedAdmins === true) {

        ctx.scene.enter('adminScene');

    } else {

        ctx.reply('Вы не являетесь админом');
        
    };

});



gpt.start((ctx) => {

    let id = ctx.from.id;

    savenewUser(ctx, id);
    
    ctx.reply('Можете задать любой вопрос, а я на него отвечу');

    ctx.scene.enter('mainScene');

})

gpt.launch();
