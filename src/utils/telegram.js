// src/utils/telegram.js
// Utility to send messages to Telegram channel using Bot API
// Usage: sendTelegramMessage('CHANNEL_USERNAME', 'Your message')

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const fetch = require('node-fetch');

async function sendTelegramMessage(channelUsername, message) {
  if (!TELEGRAM_BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN not set');
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: `@${channelUsername}`,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: false
    })
  });
  const data = await res.json();
  if (!data.ok) throw new Error('Telegram API error: ' + JSON.stringify(data));
  return data;
}

module.exports = { sendTelegramMessage };
