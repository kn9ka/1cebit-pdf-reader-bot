import TelegramBot from 'node-telegram-bot-api';
import { PDFDocument } from 'pdf-lib';
import ky from 'ky';

import 'dotenv/config';

const TOKEN = process.env.TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  console.log(chatId);
  if (msg.document && msg.document.mime_type === 'application/pdf') {
    const fileId = msg.document.file_id;
    const fileLink = await bot.getFileLink(fileId);

    bot.sendChatAction(chatId, 'typing');

    try {
      const response = await ky.get(fileLink, { responseType: 'arraybuffer' }).arrayBuffer();
      const pdfDoc = await PDFDocument.load(response, {
        updateMetadata: false,
      });

      const out = `
*Title*: ${pdfDoc.getTitle()}
*Author*: ${pdfDoc.getAuthor()}
*Subject*: ${pdfDoc.getSubject()}
*Creator*: ${pdfDoc.getCreator()}
*Keywords*: ${pdfDoc.getKeywords()}
*Producer*: ${pdfDoc.getProducer()}
*Date*: ${pdfDoc.getCreationDate()}
*ModificationDate*: ${pdfDoc.getModificationDate()}
      `;
      bot.sendMessage(chatId, out, { parse_mode: 'Markdown' });
    } catch (error) {
      if (error instanceof Error) {
        bot.sendMessage(chatId, `Возникла ошибка при обработке файла ${JSON.stringify(error.message)}}`);
      } else {
        bot.sendMessage(chatId, 'Возникла непредвиденная ошибка при обработке файла');
      }
    }
  }
});
