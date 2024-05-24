import React, { useState } from 'react';
import { View, Button } from 'react-native';

const StripePayment = () => {
  const [paymentLoading, setPaymentLoading] = useState(false);



  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      const response = await fetch('https://us-central1-purecare-2a506.cloudfunctions.net/createCheckoutSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'sk_test_51PIuTYRwhciiEfEmNZe77DxeRKdFCVT7j0QVPl80wyWm6UQR6yEiV0KbO0inqcHtj2oSkKG7orJtSicr5BJ9VaWA00BXw8w4jr',
        },
        body: JSON.stringify({}),
      });
      const responseText = await response.text(); // Get the response text
      console.log('Response from server:', responseText); // Log the response text
      const { sessionId } = JSON.parse(responseText); // Parse the response JSON
      // Redirect user to the checkout page
      console.log('Redirecting to checkout page with sessionId:', sessionId);
    } catch (error) {
      console.error('Error initiating checkout session:', error);
      // Handle unexpected errors
    }
    setPaymentLoading(false);
  };


  return (
    <View>
      <Button
        title="Pay Now"
        onPress={handlePayment}
        disabled={paymentLoading}
      />
    </View>
  );
};

export default StripePayment;
