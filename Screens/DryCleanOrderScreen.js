import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
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
  Icon,
  Divider,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import dryCleanData from "../assets/dryCleanData.json";
import useDryCleanCart from "../useDryCleanStore";
import useAppStore from "../useAppStore";

const DryCleanOrderScreen = () => {
  const navigation = useNavigation();
  const [text, setText] = useState("");

  const {
    clearCart,
    getTotalPrice,
    deliveryCost,
    deliveryOption,
    setDeliveryCost,
    setDeliveryOption,
  } = useDryCleanCart();

  const auth = FIREBASE_AUTH;

  const {name, setName, phone, setPhone, address, setAddress, indexBottom  , setIndexBottom, user, setUser, visible, setVisible, email, setEmail} = useAppStore();
  //const [name, setName] = useState("");
 

  //   const addCarWashOrder = async () => {
  //     try {
  //       const user = auth.currentUser;
  //       if (!user || !user.emailVerified) {
  //         console.error("Error: User is not authenticated.");
  //         navigation.navigate("login");

  //         return;
  //       }

  //       const userId = user?.email || "UnknownUser";
  //       if (!userId) {
  //         console.error("Error: User email is null or undefined.");
  //         return;
  //       }

  //       const counterDocRef = doc(FIRESTORE_DB, "OrderCounters", userId);
  //       const counterDocSnap = await getDoc(counterDocRef);

  //       let orderNumber = 1;
  //       if (counterDocSnap.exists()) {
  //         const counterData = counterDocSnap.data();
  //         if (counterData && counterData.orderNumber) {
  //           orderNumber = counterData.orderNumber + 1;
  //         }
  //       }

  //       const orderDocRef = doc(
  //         FIRESTORE_DB,
  //         "Car-Wash",
  //         `${userId}_${orderNumber}`
  //       );

  //       await setDoc(orderDocRef, {
  //         Email: userId,
  //         Name: name,
  //         Phone: phone,
  //         Address: address,
  //         CarBrand: carBrand,
  //         BodyType: bodyStyle,
  //         Preference: prefrenceOption, // Update Preference based on selected option
  //         Color: currentColor,
  //         PlateNumber: carPlate,
  //         Payment: paymentOption,
  //         Note: note,
  //         Delivery: deliveryOption,
  //         Total: totalCost,
  //         Status: "InProgress",
  //         Assigned: "No One",
  //       });

  //       await setDoc(
  //         counterDocRef,
  //         { orderNumber: orderNumber },
  //         { merge: true }
  //       );
  //       console.log(
  //         "Added car wash order document ID:",
  //         `${userId}_${orderNumber}`
  //       );
  //       navigation.navigate("orderComplete");
  //     } catch (error) {
  //       console.error("Error adding car wash order:", error);
  //     }
  //   };

  const Item = ({ item, lastItem }) => {
    const { addToCart, removeFromCart, itemCounts, getTotalPrice } =
      useDryCleanCart();

    return (
      <>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 5,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text>{item?.title}</Text>
            <Text>{item?.price}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              removeFromCart(item.id);
            }}
          >
            <Icon source="minus-thick" size={25} />
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 15 }}>{itemCounts[item.id]}</Text>
          <TouchableOpacity
            onPress={() => {
              addToCart(item?.id);
            }}
          >
            <Icon source="plus-thick" size={25} />
          </TouchableOpacity>
        </View>
        {!lastItem && <Divider />}
      </>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ height: 50, top: 5 }}>
        <Appbar.Content
          title={"Subtotal: $" + (getTotalPrice()+ deliveryCost).toFixed(2)}
          style={{ position: "absolute", left: 220 }}
          titleStyle={{ fontSize: 15 }}
        />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Car Location Card */}
          <Card style={styles.card}>
            <Card.Title
              title="Location"
              titleStyle={{ fontSize: 20, marginTop: 10 }}
              left={(props) => (
                <Avatar.Icon {...props} icon="map-marker" size={40} />
              )}
            />

            <View style={{ marginBottom: 5, flex: 1 }}>
              <Text
                style={{
                  fontSize: 13,
                  paddingHorizontal: 15,
                  // position: "absolute",
                  color: "blue",
                }}
                multiline={true}
                onPress={() => navigation.navigate("map")}
              >
                {address}
              </Text>
            </View>
          </Card>
          <Card style={styles.card}>
            <Card.Title
              title="Clothes"
              titleStyle={{ fontSize: 20, marginTop: 10 }}
              left={(props) => (
                <Avatar.Icon {...props} icon="tshirt-crew" size={40} />
              )}
              right={(props) => (
                <TouchableOpacity onPress={clearCart}>
                  <Avatar.Icon
                    {...props}
                    icon="trash-can"
                    size={40}
                    style={{ marginHorizontal: 30 }}
                  />
                </TouchableOpacity>
              )}
            />

            <Card.Content>
              {dryCleanData.map((item, index) => (
                <Item
                  key={item.id}
                  item={item}
                  lastItem={index === dryCleanData.length - 1}
                />
              ))}
            </Card.Content>
          </Card>
          {/* Preference Card */}

          <Card style={styles.card}>
            <Card.Title
              title="Delivery"
              titleStyle={{ fontSize: 20, marginTop: 10 }}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="calendar-clock-outline"
                  size={40}
                />
              )}
            />
            <Text
              style={{
                fontSize: 15,
                left: 240,
                top: 60,
                color: "green",
                position: "absolute",
              }}
            >
              {"+$3.99"}
            </Text>
            <RadioButton.Group
              onValueChange={(newValue) => {
                setDeliveryOption(newValue);
                if (newValue === "Standard") {
                  setDeliveryCost(0);
                 // setDate("30-45 min");
                } else if (newValue === "Priority") {
                  setDeliveryCost(3.99);
                 // setDate("15-30 min");
                }
              }}
              value={deliveryOption}
            >
              <View style={styles.radioContainer}>
                <RadioButton.Item label="Standard" value="Standard" />
                <RadioButton.Item label="Schedule" value="Schedule" disabled />
                <RadioButton.Item label="Priority" value="Priority" />
              </View>
            </RadioButton.Group>
          </Card>

          <Button
            style={{ marginBottom: 28, bottom: -10 }}
            mode="contained"
            onPress={() => {
              navigation.navigate("checkOut", {
                addCarWashOrder: addCarWashOrder,
              });
              // updateTotalCost(2);
            }}
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
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: "column",
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    backgroundColor: "white",
    paddingTop: 15,
  },
  card: {
    marginBottom: 16,
    borderWidth: 0.5,
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
    borderWidth: 3,
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
    borderWidth: 3,
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
export default DryCleanOrderScreen;
