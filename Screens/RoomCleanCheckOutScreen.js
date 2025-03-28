import NetInfo from "@react-native-community/netinfo";
import { useRoute } from "@react-navigation/native";
import { useStripe } from "@stripe/stripe-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import {
  Appbar,
  Avatar,
  Button,
  Card,
  RadioButton,
  Text,
  useTheme
} from "react-native-paper";
import useAppStore from "../useAppStore";
import useRoomCleanCart from "../useRoomCleanStore";
import LogInScreen from "./LogInScreen";
const RoomCleanCheckOutScreen = () => {
  const [userInfo, setUserInfo] = useState({});
  const route = useRoute();
  const auth = FIREBASE_AUTH;
  const {
    name,
    address,
    user,
    setUser,
    setVisible,
    email,
  } = useAppStore();
  const { addRoomCleanOrder } = route.params; // Assuming route.params is available
  const {
    getTotalPrice,
    supplyCost,
    supplyOption,
    packageOption,
    packageCost,
    deliveryCost,
    deliveryOption,
    paymentOption,
    setPaymentOption,
    getItemCountsWithTitles,
    serviceTime,
    date  } = useRoomCleanCart();
  const [isLoading, setIsLoading] = useState(false);
const theme = useTheme();
  ///////////////////////////////////////////////////////////////////////////// Payment Stripe////////////////////////
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const API_URL ='https://stripeapiendpoint-p2xcnmarfq-uc.a.run.app'
  //stripe state

  //
  // payment handler api
  const initializePaymentSheet = async (price) => {
    try {
      console.log('Initializing payment sheet');
      const {
        paymentIntent,
        ephemeralKey,
        customer,
      } = await fetchPaymentSheetParams(price);
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Room Wash',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        returnURL: 'https://url.com/',
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          name: name,
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
       // setLoading(true);
        const { error } = await presentPaymentSheet();
        if (error) {
          Alert.alert(`Payment cancelled`);
        } else {
          //after successful payment
          Alert.alert(
            "Payment Successful",
            "Your payment has been successfully processed.",
            [{ text: "OK", onPress: () => handleConfirmOrder() }]
          );
        }
      }
    } catch (error) {
      console.error('Error initializing payment sheet:', error);
    } finally {
     // setLoading(false);
      setIsLoading(false); // Show activity indicator
    }
  };
  const fetchPaymentSheetParams = async (price) => {
    const customerIdResponse = await fetch(`${API_URL}/retrieveOrCreateCustomer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
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
  useEffect(() => {
    setVisible(false);
  }, []);
  const handleCardPayment = async () => {
    setPaymentLoading(true);
    try {
      const price = (getTotalPrice()+ deliveryCost + supplyCost + packageCost + 4 + ((getTotalPrice()+ deliveryCost + packageCost + supplyCost + 4) * 0.05) ).toFixed(2);
      await initializePaymentSheet(price);
    } catch (error) {
      console.error('Error initiating checkout session:', error);
      // Handle unexpected errors
    }
    setPaymentLoading(false);
  };
  const maxWidth = getItemCountsWithTitles().reduce(
    (max, item) => Math.max(max, item.title.length),
    0
  );
  const handleConfirmOrder = async () => {
    setIsLoading(true); // Show activity indicatorr
    try {
      const isConnected = await NetInfo.fetch().then(
        (state) => state.isConnected
      );
      if (!isConnected) {
        // No internet connection
        Alert.alert("No Internet", "Please check your internet connection.");
        return;
      }
      if (addRoomCleanOrder) {
        // Check if the function exists
        await addRoomCleanOrder(); // Call the function
        // Send SMS notification
        const message = "Hooray! There's a new Room Cleaning order ready for you to fulfill!" + " " + paymentOption;
        const response = await fetch(`${API_URL}/send-order-confirmation-sms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        });
        if (!response.ok) {
          throw new Error('Failed to send SMS');
        }
      }
    } catch (error) {
      // console.error("Error adding car wash order:", error);
    } finally {
      setIsLoading(false); // Hide activity indicator
    }
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Update user state based on authentication status
    });
    return unsubscribe; // Clean up the subscription
  }, [auth]);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!user || !user.emailVerified) {
          // If user is not logged in or email is not verified, return early
          return;
        }
        const userDocRef = collection(FIRESTORE_DB, "Users");
        const querySnapshot = await getDocs(userDocRef);
        const userData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .find((data) => data.userId === user.uid); // Assuming userId field in Firestore
       // console.log(userData);
        if (userData) {
          setUserInfo(userData);
        } else {
         // console.log("User data not found.");
        }
      } catch (error) {
       // console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, [user]);
  if (!user || !user.emailVerified) {
    return <LogInScreen />;
  }
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header style={{ height: 50, top: 10 }}>
        <Appbar.Content
          title={"Total: $" + (getTotalPrice()+ deliveryCost + supplyCost + packageCost + 4 + ((getTotalPrice()+ deliveryCost + packageCost + supplyCost + 4) * 0.05)).toFixed(2)}
          style={{ position: "absolute", alignItems: 'flex-end', right: 30 }}
          titleStyle={{ fontSize: 20 }}
        />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
          {/* Car Location Card */}
          <Card style={[styles.card, {borderColor: theme.colors.onBackground}]}>
            <Card.Title
              title={address}
              titleStyle={{
                fontSize: 18,
                maxWidth: "100%",
                height: 60,
                padding: 10,
                left: -10,
                textAlignVertical: "center",
              }}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="map-marker"
                  size={50}
                  left={-10}
                />
              )}
              multiline={2}
            />
          </Card>
          <Card style={[styles.card, {borderColor: theme.colors.onBackground}]}>
            <Card.Title
              title={deliveryOption}
              titleStyle={{ fontSize: 18, marginTop: 10 }}
              subtitle={deliveryOption === "Schedule" ? date?.toString() : serviceTime}
              subtitleStyle={{fontSize: 12, letterSpacing: 3}}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="calendar-clock-outline"
                  size={55}
                  left={-10}
                />
              )}
            />
          </Card>
          <Card style={[styles.card, {borderColor: theme.colors.onBackground}]}>
            <Card.Title
              title={packageOption + " " + "Cleaning"}
              titleStyle={{ fontSize: 18 }}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="home-city"
                  size={55}
                  left={-10}
                  bottom={0}
                />
              )}
            />
            <View
              style={{
                marginLeft: 75,
                bottom: 15,
              }}
            >
              {getItemCountsWithTitles().map((item, index) => (
                <Text
                  key={index}
                  style={{
                    fontSize: 12,
                    fontFamily: "monospace",
                    marginVertical: 5,
                  }}
                >
                  {item.title.padEnd(maxWidth + 3)}X{" "}
                  {item.count.toString().padEnd(1)}
                </Text>
              ))}
            </View>
          </Card>
          <Card style={[styles.card, {borderColor: theme.colors.onBackground}]}>
            <Card.Title
              title={"Cleaning Supply"}
              titleStyle={{ fontSize: 18, marginTop: 10 }}
              subtitle={supplyOption}
              subtitleStyle={{fontSize: 12, letterSpacing: 3}}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="basket"
                  size={55}
                  left={-10}
                />
              )}
            />
          </Card>
          <Card style={[styles.card, {borderColor: theme.colors.onBackground}]}>
            <Card.Title
              // title="Note"
              titleStyle={{ fontSize: 18, marginTop: 10 }}
              // subtitle= "example"
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="human-dolly"
                  size={55}
                  left={-10}
                  bottom={-5}
                />
              )}
            />
            <Card.Content
              style={{ marginHorizontal: 50, marginTop: -60, width: 275 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 20,
                }}
              >
                <View style={{ alignItems: "flex-start" }}>
                  <Text>Subtotal</Text>
                  <Text>Service Fee</Text>
                  <Text>Taxes & Other Fees</Text>
                  <Text style={{fontWeight: "bold"}}>Total</Text>
                </View>
                <View style={{ alignItems: "flex-start", left: 10 }}>
                  <Text> ${(getTotalPrice() + deliveryCost + supplyCost + packageCost).toFixed(2)}</Text>
                  <Text> $4.00</Text>
                  <Text> ${((getTotalPrice() + deliveryCost + packageCost + supplyCost + 4) * 0.05).toFixed(2)}</Text>
                  <Text style={{fontWeight: "bold"}}>
                    {" "}
                    ${(getTotalPrice() + deliveryCost + supplyCost + packageCost + 4 + ((getTotalPrice()+ deliveryCost + packageCost + supplyCost + 4) * 0.05)).toFixed(2)}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
          <Card style={[styles.card, {borderColor: theme.colors.onBackground}]}>
            <Card.Title
              title="Payment"
              titleStyle={{ fontSize: 20, marginTop: 10 }}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="cash"
                  size={55}
                  left={-10}
                  bottom={-15}
                />
              )}
            />
            <RadioButton.Group
              onValueChange={(newValue) => {
                setPaymentOption(newValue);
              }}
              value={paymentOption}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginTop: -30,
                  marginHorizontal: 50,
                  borderColor: "red",
                }}
              >
                <RadioButton.Item label="Cash" value="Cash" disabled={isLoading} />
                <RadioButton.Item label="Card" value="Card" disabled={isLoading} />
              </View>
            </RadioButton.Group>
          </Card>
          {isLoading && (
        <View style={{position: "absolute",
    top: "50%", // Position at half of the screen vertically
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
          <Button
            style={{ marginBottom: 50, top: 25, borderWidth: 1 }}
            mode="contained"
            onPress={() => {
if (paymentOption === "Card") {
  setIsLoading(true); // Show activity indicator
  handleCardPayment();
} else {
  handleConfirmOrder();
}
}}            labelStyle={{
          fontSize: 20,
          textAlignVertical: "center",
         // letterSpacing: 10,
        }}
        disabled={isLoading} // Disable the button while loading
      >
            Confirm
          </Button>
          {/* Other cards */}
          {/* Delivery, Additional Note, Payment Options, etc. */}
        </View>
      </ScrollView>
      {/* Modal */}
    </View>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    flexDirection: "column",
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 15,
  },
  card: {
    marginBottom: 16,
    borderWidth: 1,
  },
  input: {
    marginLeft: 20,
    bottom: 10,
    height: 50,
    width: 300,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  radioContainerDeliverey: {
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: -15,
    marginHorizontal: 20,
  },
  rectangularButton: {
    width: 90,
    height: 40,
    borderRadius: 15,
    marginVertical: 10,
    marginLeft: 30,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
    margin: 25,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 35, // Add margin bottom for spacing
  },
  colorBox: {
    width: 100,
    height: 75,
    borderRadius: 15,
    alignSelf: "center",
    bottom: 450,
    left: 95,
  },
});
export default RoomCleanCheckOutScreen;
