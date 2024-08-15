const functions = require("firebase-functions/v2/https");
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const dotenv = require('dotenv');
const stripe = require('stripe');
const { readFileSync } = require('fs');
const twilio = require('twilio');

// Load environment variables from a .env file
dotenv.config({ path: './env/.env.local' });

const stripeSecretKey = process.env.STRIPE_SK;
const stripeClient = stripe(stripeSecretKey);

// Twilio configuration
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

// Read the contents of the JSON file synchronously
const serviceAccount = JSON.parse(readFileSync('./config/config.json', 'utf-8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Initialize Firestore
const db = admin.firestore();

// Create Express application
const testing01 = express();

// Middleware
testing01.use(cors());
testing01.use(express.json());

// Function to send SMS notifications to multiple phones
const sendSmsNotification = async (message) => {
  try {
    // Retrieve phone numbers from Firestore
    const snapshot = await db.collection('smsRecipients').get();
    const phoneNumbers = snapshot.docs.map(doc => doc.data().phoneNumber);

    // Send SMS to each phone number
    const promises = phoneNumbers.map(number =>
      twilioClient.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: number
      })
    );

    await Promise.all(promises);
    console.log('SMS sent successfully to all recipients!');
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

// React Native API for one-time payment event
testing01.post('/payment-sheet-onetime', async (req, res) => {
  const { amount, customerId } = req.body;

  try {
    // Create ephemeral key
    const ephemeralKey = await stripeClient.ephemeralKeys.create(
      { customer: customerId },
      { apiVersion: '2022-11-15' }
    );

    // Create payment intent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: amount * 100,
      currency: 'cad',
      setup_future_usage: 'off_session',
      customer: customerId,
      payment_method_types: ['card'],
    });

    // Send SMS notification
    const smsMessage = `Order Completed: Your payment of $${amount} was successful!`;
    await sendSmsNotification(smsMessage);

    // Respond with payment information
    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customerId,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Retrieve or create customer for Stripe
testing01.post('/retrieveOrCreateCustomer', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the customer already exists
    let customer = await stripeClient.customers.list({ email, limit: 1 });

    if (customer.data.length > 0) {
      res.json({ customerId: customer.data[0].id });
    } else {
      // Create a new customer
      customer = await stripeClient.customers.create({ email });
      res.json({ customerId: customer.id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Health check endpoint
testing01.get('/', (req, res) => {
  res.send({ message: 'server is running' });
});

// Export the Express app as a Firebase Cloud Function
exports.stripeApiEndPoint = functions.onRequest(testing01);
