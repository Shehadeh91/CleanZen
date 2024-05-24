const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// const path = require("path");
const stripe = require("stripe")(`
  sk_test_51PIuTYRwhciiEfEmNZe77DxeRKdFCVT7
  j0QVPl80wyWm6UQR6yEiV0KbO0inqcHtj2oSkKG7orJtSicr5BJ9VaWA00BXw8w4jr
`);

// Path to your service account key JSON file
// const serviceAccount = require(path.resolve(__dirname, `./purecare-2a506-
// firebase-adminsdk-j5azu-8607d40b26.json`),
// );

// Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://purecare-2a506-default-rtdb.firebaseio.com",
// });

const YOUR_DOMAIN = "https://purecare-2a506.firebaseapp.com"; // Update this with your actual domain

exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "PureCare Service",
              // Add more product details as needed
            },
            unit_amount: 1000, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });
    res.json({sessionId: session.id});
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({error: "Could not create checkout session"});
  }
});
