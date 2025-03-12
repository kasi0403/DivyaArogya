const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendNotification(message) {
    console.log("Send reached");
    try {
        const messageSend = await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: process.env.TO_PHONE_NUMBER
        });
    
        console.log('Message sent successfully:', messageSend.sid);
      } catch (error) {
        console.error('Error sending message:', error.message, error.code);
    }
}

module.exports = sendNotification;