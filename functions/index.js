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
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
app.post('/payment-sheet-onetime', async (req, res) => {
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

// Endpoint to send SMS confirmation for an order
app.post('/send-order-confirmation-sms', async (req, res) => {
  const { message } = req.body;

  try {
    // Send SMS notification
    await sendSmsNotification(message);

    // Respond with success
    res.status(200).send('Order confirmation SMS sent successfully');
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Retrieve or create customer for Stripe
app.post('/retrieveOrCreateCustomer', async (req, res) => {
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
    console.error('Error retrieving or creating customer:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send({ message: 'Server is running' });
});

// Export the Express app as a Firebase Cloud Function
exports.stripeApiEndPoint = functions.onRequest(app);