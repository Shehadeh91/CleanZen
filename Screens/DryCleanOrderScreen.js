import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity, Alert
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
import { LogBox } from "react-native";


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
    itemCounts,
    paymentOption,
    setPaymentOption,
    note,
    setNote,
    getItemCountsWithTitles,
    serviceTime,
    setServiceTime
  } = useDryCleanCart();

  const auth = FIREBASE_AUTH;

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
  //const [name, setName] = useState("");

  const addDryCleanOrder = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !user.emailVerified) {
       // console.error("Error: User is not authenticated.");
        navigation.navigate("login");

        return;
      }

      const userId = user?.email || "UnknownUser";
      if (!userId) {
        //console.error("Error: User email is null or undefined.");
        return;
      }

      const counterDocRef = doc(FIRESTORE_DB, "OrderCounters", userId);
      const counterDocSnap = await getDoc(counterDocRef);

      let orderNumber = 1;
      if (counterDocSnap.exists()) {
        const counterData = counterDocSnap.data();
        if (counterData && counterData.orderNumber) {
          orderNumber = counterData.orderNumber + 1;
        }
      }

      const orderDocRef = doc(
        FIRESTORE_DB,
        "Dry-Clean",
        `${userId}_${orderNumber}`
      );

      await setDoc(orderDocRef, {
        Email: userId,
        Name: name,
        Phone: phone,
        Address: address,

        Items: getItemCountsWithTitles(),

        Payment: paymentOption,
        Note: note,
        Delivery: deliveryOption,
        Total: "$" + (getTotalPrice() + deliveryCost).toFixed(2),
        Status: "InProgress",
        Assigned: "No One",
        Service: "Dry Clean",
        EstimateTime: serviceTime
      });

     

      await setDoc(
        counterDocRef,
        { orderNumber: orderNumber },
        { merge: true }
      );
    
      navigation.navigate("orderComplete");
    } catch (error) {
     //console.error("Error adding car wash order:", error);
    }
  };


  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

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
            <Text style={{ color: "green" }}>${item?.price}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              removeFromCart(item.id);
            }}
          >
            <Icon source="minus-thick" size={20} />
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 15 }}>{itemCounts[item.id]}</Text>
          <TouchableOpacity
            onPress={() => {
              addToCart(item?.id);
            }}
          >
            <Icon source="plus-thick" size={20} />
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
          title={"Subtotal: $" + (getTotalPrice() + deliveryCost).toFixed(2)}
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
                <TouchableOpacity onPress={() => navigation.navigate("map")}>
                  <Avatar.Icon {...props} icon="map-marker" size={40} />
                </TouchableOpacity>
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
              title="Service Time"
              titleStyle={{ fontSize: 20, marginTop: 10 }}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  icon="calendar-clock-outline"
                  size={40}
                />
              )}
            />

            <RadioButton.Group
              onValueChange={(newValue) => {
                setDeliveryOption(newValue);
                if (newValue === "Standard") {
                  setDeliveryCost(0);
                  setServiceTime(2880);
                } else if (newValue === "Priority") {
                  setDeliveryCost(3.99);
                  setServiceTime(1440);
                }
              }}
              value={deliveryOption}
            >
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  //alignItems: "center",
                  bottom: 13,
                  marginBottom: 8,
                  marginLeft: 10,
                }}
              >
                <RadioButton.Item label="Standard" value="Standard" />
                <Text
                  style={{
                    fontSize: 13,
                    left: 17,
                    top: 37,
                    color: "grey",
                    position: "absolute",
                  }}
                >
                  {"2 - 3 day"}
                </Text>
                {/* <RadioButton.Item
                    label="Schedule"
                    value="Schedule"
                    disabled
                  /> */}
                <RadioButton.Item label="Priority" value="Priority" />
                <Text
                  style={{
                    fontSize: 13,
                    left: 80,
                    top: 69,
                    color: "green",
                    position: "absolute",
                  }}
                >
                  {"(+$3.99)"}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    left: 17,
                    top: 90,
                    color: "grey",
                    position: "absolute",
                  }}
                >
                  {"1 - 2 day"}
                </Text>
              </View>
            </RadioButton.Group>
          </Card>

          <Button
            style={{ marginBottom: 28, bottom: -10 }}
            mode="contained"
            onPress={() => {
              if (!deliveryOption) {
                Alert.alert(
                  "Error",
                  "Please select a service time before confirming."
                );
                return;
              }
              navigation.navigate("dryCleanCheckOut", {
                addDryCleanOrder: addDryCleanOrder,
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
