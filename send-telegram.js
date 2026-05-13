// Example usage: node send-telegram.js "Your message here"
require('dotenv').config();
const { sendTelegramMessage } = require('./src/utils/telegram');

const channel = 'PetCarePlus_KR_Channel'; // Replace with your channel username (without @)
const message = process.argv[2] || '테스트 메시지입니다!';

sendTelegramMessage(channel, message)
  .then(res => {
    console.log('Message sent:', res);
  })
  .catch(err => {
    console.error('Error:', err);
  });
