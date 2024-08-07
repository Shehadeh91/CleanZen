const twilio = require('twilio');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../functions/env/.env.local' });

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const myPhoneNumber = process.env.MY_PHONE_NUMBER;

const client = twilio(twilioAccountSid, twilioAuthToken);

const sendTestSms = async () => {
  try {
    const message = await client.messages.create({
      body: 'This is a test message from Twilio!',
      from: twilioPhoneNumber, // Your Twilio phone number
      to: myPhoneNumber // Your personal phone number
    });
    console.log('Message sent successfully:', message.sid);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

sendTestSms();
