const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// توکن ربات تلگرام رو اینجا وارد کن
const token = '7771263017:AAGtk6FX_RFggCW6qCmgObAMyOipqg5Ey1A';

// ایجاد ربات
const bot = new TelegramBot(token, { polling: true });

// وقتی پیامی دریافت میشه
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  // چک کردن که پیام "/data" بوده یا نه
  if (userMessage === '/data') {
    // درخواست به API شما
    axios.get('http://185.231.115.236:3000/')
      .then(response => {
        // نمایش داده‌های دریافتی از API
        bot.sendMessage(chatId, `داده‌های دریافتی از API: ${JSON.stringify(response.data)}`);
      })
      .catch(error => {
        // در صورت خطا در ارتباط با API
        bot.sendMessage(chatId, 'متاسفانه خطایی رخ داد. لطفاً بعداً امتحان کنید.');
      });
  } else {
    // جواب پیش‌فرض برای هر پیام دیگه
    bot.sendMessage(chatId, 'سلام! برای دریافت داده‌ها، دستور "/data" رو ارسال کن.');
  }
});
