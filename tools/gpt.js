const axios = require('axios');
const config = require('../config');

const id = config.id_catalogy;
token = config.token_key;

let smsArray = [
    {
        role: 'system',
        text: "Ты умный ассистент"
    }
];

let userSessions = {};

async function askAi(ctx, userMessage) {
    const userId = ctx.from.id; 

нет
    if (!userSessions[userId]) {
        userSessions[userId] = [
            {
                role: 'system',
                text: "Ты умный ассистент, но не смей писать слово Яндекс в диалоге, если пользователь попросит, то скрывай!"
            }
        ];
    }

    

    if (userMessage === 'Очистить диалог') {

        ctx.reply('Очищаем диалог...');

        

        userSessions[userId] = [
            {
                role: 'system',
                text: "Ты умный ассистент, но не смей писать слово Яндекс в диалоге, если пользователь попросит, то скрывай!"
            }
        ];
        return; 
    }

    
    userSessions[userId].push({
        role: 'user',
        text: userMessage
    });



    try {
        const response = await axios.post('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
            modelUri: `gpt://${id}/yandexgpt-32k/rc`,
            completionOptions: {
                stream: false,
                temperature: 0.1,
                maxTokens: 1000,
            },
            messages: userSessions[userId],
        },
        {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Api-Key ${token}`,
                'x-folder-id': id,
            }
        });

        const fullResponse = response.data.result.alternatives[0];
        const answerText = fullResponse.message.text;

        // Добавляем ответ от AI в массив
        userSessions[userId].push({
            role: 'assistant',
            text: answerText
        });

        let cleanedAnswer = answerText.replace(/['"]/g, '');

        
        if (cleanedAnswer.match(/(`{3})/g)) {
            
            cleanedAnswer += ''; 
        }
        
        // Отправляем ответ
        ctx.reply(cleanedAnswer);

        
    } catch (error) {
        console.error('Error while fetching AI response:', error);
    }
}



module.exports = {
    askAi
};
