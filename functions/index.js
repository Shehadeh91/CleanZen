const functions = require("firebase-functions/v2/https");
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const dotenv = require('dotenv');
const stripe = require('stripe');
const { readFileSync } = require('fs');

// Load environment variables from a .env file
dotenv.config({ path: './env/.env.local' });

const stripeSecretKey = process.env.STRIPE_SK;
const stripeClient = stripe(stripeSecretKey);

// Read the contents of the JSON file synchronously
const serviceAccount = JSON.parse(readFileSync('./config/config.json', 'utf-8'));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Create a Firestore instance
const db = admin.firestore();
//
// Create Express application
const testing01 = express();

// Middleware
testing01.use(cors());

testing01.use(express.json());

// Function to send push notifications
const sendPushNotification = async (registrationToken, notification) => {
  const message = {
    notification: notification,
    token: registrationToken
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.log('Error sending message:', error);
  }
};

//react native api for onetime payment event
testing01.post('/payment-sheet-onetime', async (req, res) => {
  // Get data from front end
  const {
    amount, customerId
  } = req.body;
  console.log(amount);



  const ephemeralKey = await stripeClient.ephemeralKeys.create(
    { customer: customerId },
    { apiVersion: '2022-11-15' }
  );

  // Create paymentIntent with or without transfer data and application fee
  let paymentIntentParams = {
    amount: amount * 100,
    currency: 'cad',
    setup_future_usage: 'off_session', //enable to save payment method by default
    customer: customerId,
    payment_method_types: ['card'],
    // automatic_payment_methods: {
    //     enabled: true,
    // },
    metadata: {

    },
  };



  const paymentIntent = await stripeClient.paymentIntents.create(paymentIntentParams);

  console.log({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customerId,
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customerId,
  });
});


//retrieve or create customer for stripe for user end
testing01.post('/retrieveOrCreateCustomer', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the customer already exists
    let customer = await stripeClient.customers.list({ email, limit: 1 });

    if (customer.data.length > 0) {
      // Customer already exists, return existing customer id
      res.json({ customerId: customer.data[0].id });
    } else {
      // Create a new customer
      customer = await stripeClient.customers.create({ email });

      // Return the new customer id
      res.json({ customerId: customer.id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});







testing01.get('/', (req, res) => {
  res.send({
    message: 'server is running'
  });
});

exports.stripeApiEndPoint = functions.onRequest(testing01);

//Firestore trigger to send push notifications
exports.paymentIntentSucceeded = functions.firestore.document('payments/{paymentId}').onUpdate(async (change, context) => {
  const payment = change.after.data();
  if (payment.status === 'succeeded') {
    const registrationToken = payment.userToken; // Assumes you store the user's FCM token in the payment document
    const notification = {
      title: 'Payment Success',
      body: `Your payment of $${payment.amount / 100} was successful!`
    };

    await sendPushNotification(registrationToken, notification);
  }
});