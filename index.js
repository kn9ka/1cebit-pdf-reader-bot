const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const TOKEN = process.env.TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });

const MAIN_CHAT_ID = process.env.CHAT_ID;

const PROHIBITED_WORDS = [
  'обмен валют',
  'обмен',
  'usdt',
  'обмен usdt',
  'конвертация',
  'валютная пара',
  'рубли, юсдт',
  'вывести деньги',
  'перевести деньги',
  'нужны рубли',
  'нужны наличные',
  'поменять крипт',
  'поменять рубли',
  'поменять евро',
  'нужны евро',
  'отдаю евро',
  'перевести деньги',
  'поменять доллары',
  'обменять доллары',
  'btc',
  'eth',
  'trx',
];

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const {
    from: { first_name, last_name, username },
    text: msgText,
    chat: { title },
  } = msg;

  const cleanText = msgText.toLocaleLowerCase();
  console.log(chatId);
  if (PROHIBITED_WORDS.some((word) => cleanText.includes(word))) {
    const text = `
<b>Отправитель: </b> ${first_name} ${last_name} @${username}
<b>Название группы:</b> ${title}
---------------------------------------------------------------
<i>Сообщение: </i>

${msgText}
  `;

    bot.sendMessage(MAIN_CHAT_ID, text, { parse_mode: 'HTML' });
  }
});
