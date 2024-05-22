import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import firebase from "firebase/compat/app";
import {
  Card,
  Title,
  Appbar,
  Avatar,
  RadioButton,
  Text,
  Button,
  TextInput,
  Modal,
  Portal,
  PaperProvider,
} from "react-native-paper";
import useCarWashStore from "../useCarWashStore";
import useAppStore from "../useAppStore";
import LogInScreen from "./LogInScreen";
import useDryCleanCart from "../useDryCleanStore";

const DryCleanCheckOutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    name,
    setName,
    phone,
    setPhone,
    address,
    setAddress,
    indexBottom,
    setIndexBottom,
    user,
    setUser,
    visible,
    setVisible,
    email,
    setEmail,
  } = useAppStore();

  const { addDryCleanOrder } = route.params; // Assuming route.params is available

  const {
    clearCart,
    getTotalPrice,
    deliveryCost,
    deliveryOption,
    setDeliveryCost,
    setDeliveryOption,
    itemCounts,
    paymentOption,
    setPaymentOption,
    note,
    setNote,
    getItemCountsWithTitles,
    serviceTime,
    SetServiceTime
  } = useDryCleanCart();

  const [isLoading, setIsLoading] = useState(false);

  const maxWidth = getItemCountsWithTitles().reduce(
    (max, item) => Math.max(max, item.title.length),
    0
  );

  const handleConfirmOrder = async () => {
    setIsLoading(true); // Show activity indicator
    try {
      const isConnected = await NetInfo.fetch().then(
        (state) => state.isConnected
      );
      if (!isConnected) {
        // No internet connection
        Alert.alert("No Internet", "Please check your internet connection.");
        return;
      }

      if (addDryCleanOrder) {
        // Check if the function exists
        await addDryCleanOrder(); // Call the function
        // Other logic after adding the car wash order
      
        //
      }
    } catch (error) {
      // console.error("Error adding car wash order:", error);
    } finally {
      setIsLoading(false); // Hide activity indicator
    }
  };

  const goToLogIn = () => {
    navigation.navigate("login");

    setIndexBottom(1);
  };

  useEffect(() => {
    if (!user) {
      goToLogIn();
    }
  }, [user]);

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ height: 50, top: 5 }}>
        <Appbar.Content
          title={"Total: $" + (getTotalPrice() + 4 + 1.5).toFixed(2)}
          style={{ position: "absolute", left: 220 }}
          titleStyle={{ fontSize: 20 }}
        />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Car Location Card */}

          <Card style={styles.card}>
            <Card.Title
              title={address}
              titleStyle={{
                fontSize: 18,
                flexWrap: "wrap",
                // textAlign: "center",
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
          <Card style={styles.card}>
            <Card.Title
              title={deliveryOption}
              titleStyle={{ fontSize: 18, marginTop: 10 }}
              subtitle={serviceTime}
              subtitleStyle={{fontSize: 12, color: 'grey', letterSpacing: 3}}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="calendar-clock-outline"
                  size={55}
                  left={-10}
                />
              )}
            />
            {/* <Text
                style={{ fontSize: 20, left: 200, bottom: 50, color: "green", borderWidth: 1, borderColor: 'red', width: 100, height: 100, marginBottom: -25 }}
              >
                {deliveryCost}
               
              </Text> */}
          </Card>

          <Card style={styles.card}>
            <Card.Title
              title={"Dry Clean"}
              titleStyle={{ fontSize: 18 }}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="tshirt-crew"
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

          <Card style={styles.card}>
            <Card.Title
               title="Add Additional Note"
              titleStyle={{ fontSize: 18, marginTop: 10 }}
              // subtitle= "example"

              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="note"
                  size={55}
                  left={-10}
                  bottom={-5}
                />
              )}
            />
            <Card.Content
              style={{ marginHorizontal: 50, marginTop: -15, width: 275 }}
            >
              <TextInput
                //label="Address"
                value={note}
                mode="outlined"
                borderColor="red"
                // borderWidth = {2}
                onChangeText={(text) => setNote(text)}
                // width={200}
              />
            </Card.Content>
          </Card>
          <Card style={styles.card}>
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
                  // marginTop: 20,
                }}
              >
                <View style={{ alignItems: "flex-start" }}>
                  <Text>Subtotal</Text>
                  <Text>Service Fee</Text>
                  <Text>Taxes & Other Fees</Text>
                </View>
                <View style={{ alignItems: "flex-start", left: 10 }}>
                  <Text> ${(getTotalPrice() + deliveryCost).toFixed(2)}</Text>
                  <Text> $4.00</Text>
                  <Text> $1.50</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
          <Card style={styles.card}>
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
                //   updateTotalCost(bodyStyleCost + prefrenceCost + deliveryCost + 100)
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
                <RadioButton.Item label="Cash" value="Cash" />
                <RadioButton.Item label="Card" value="Card" disabled />
              </View>
            </RadioButton.Group>
          </Card>
          {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
          <Button
            style={{ marginBottom: 50, top: 10, borderWidth: 1 }}
            mode="contained"
            onPress={() => handleConfirmOrder()}
            labelStyle={{
              fontSize: 20,
              textAlignVertical: "center",
              letterSpacing: 10,
            }}
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
    // borderWidth: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "white",
    paddingTop: 15,
    // borderWidth: 2
  },
  card: {
    marginBottom: 16,
    borderWidth: 3,
    backgroundColor: "#F3E9F9",
  },
  input: {
    marginLeft: 20,
    bottom: 10,
    height: 50,
    width: 300,
    backgroundColor: "white",
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  radioContainerDeliverey: {
    //flexDirection: "row",
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
    //justifyContent: "center",
    // alignItems: "center",
    //backgroundColor: "#007bff",
    marginVertical: 10,
    marginLeft: 30,
  },
  modalContainer: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    // margin: 0,
    height: "80%",
    margin: 25,
  },
  modalContainerColorWheel: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    // margin: 0,
    height: "80%",
    margin: 25,
    borderWidth: 1,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 35, // Add margin bottom for spacing
  },
  colorBox: {
    // marginTop: -30,
    //
    width: 100,
    height: 75,
    borderRadius: 15,

    alignSelf: "center",
    bottom: 450,
    left: 95,
  },
});

export default DryCleanCheckOutScreen;
