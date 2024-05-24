import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { confirmPayment } from '@stripe/stripe-react-native';
import useCarWashStore from '../useCarWashStore';




const StripePayment = () => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { totalCost } = useCarWashStore();
  const API_URL ='https://stripeapiendpoint-p2xcnmarfq-uc.a.run.app'

  //stripe state yes

  const [loading, setLoading] = useState(false);
  //


  // payment handler api
  const initializePaymentSheet = async (price) => {
    try {
      console.log('Initializing payment sheet');
      const {
        paymentIntent,
        ephemeralKey,
        customer,
        publishableKey,
      } = await fetchPaymentSheetParams(price);

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Restaurant',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        returnURL: 'https://url.com/',
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: 'Customer Name',
        },
        applePay: {
          merchantCountryCode: 'US',
        },
        googlePay: {
          merchantCountryCode: 'US',
          testEnv: true,
        },
      });

      if (!error) {
        setLoading(true);
        const { error } = await presentPaymentSheet();

        if (error) {
          Alert.alert(`Payment cancelled`);
        } else {
          //after successful payment

          Alert.alert(
            "Payment Successful",
            "Your payment has been successfully processed.",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }]
          );
        }
      }
    } catch (error) {
      console.error('Error initializing payment sheet:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentSheetParams = async (price) => {
    const customerIdResponse = await fetch(`${API_URL}/retrieveOrCreateCustomer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@gmail.com',
      }),
    });

    const { customerId } = await customerIdResponse.json();

    const response = await fetch(`${API_URL}/payment-sheet-onetime`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: price,
        customerId,

      }),
    });

    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };






  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      const price = totalCost;
      await initializePaymentSheet(price);
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
