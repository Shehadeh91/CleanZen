import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { Button, Icon, MD3Colors } from "react-native-paper";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import LogInScreen from "./LogInScreen";
import { useUser } from "../useAppStore";
import { collection, query, getDocs, Firestore } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { Swipeable } from "react-native-gesture-handler";

import { doc, getDoc, setDoc } from "firebase/firestore";

const OrderScreen = () => {
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;
  const [user, setUser] = useUser((state) => [state.user, state.setUser]);
  const [orders, setOrders] = useState([]);
  const [showInProgress, setShowInProgress] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);
  const [highlightedButton, setHighlightedButton] = useState("InProgress");
  const [inProgressOrders, setInProgressOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  const swipeableRef = useRef(null);

  const filterOrders = (status) =>
    inProgressOrders.filter((order) => order.Status === status);

  const handleButtonPress = (status) => {
    setShowInProgress(status === "InProgress");
    setShowCompleted(status === "Completed");
    setShowCanceled(status === "Canceled");
    setHighlightedButton(status);
  };

  useEffect(() => {
    let isMounted = true; // Flag to track component mount state

    const fetchOrders = async () => {
      try {
        if (!user || !user.email) {
          console.error("User is not logged in or has no email.");
          return;
        }

        const ordersRef = collection(FIRESTORE_DB, "Car-Wash");
        const querySnapshot = await getDocs(ordersRef);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter orders by user's email
        const userOrders = data.filter((order) => order.Email === user.email);

        if (isMounted) {
          // Update state by reversing the order of new orders
          setInProgressOrders(
            userOrders
              .filter((order) => order.Status === "InProgress")
              .reverse()
          );
          setCanceledOrders(
            userOrders.filter((order) => order.Status === "Canceled").reverse()
          );
          setCompletedOrders(
            userOrders.filter((order) => order.Status === "Completed").reverse()
          );
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false on unmount
    };
  }, [user]);

  const carBrandIcons = {
    Mazda: require("../assets/Icons/mazda.png"),
    Mercedes: require("../assets/Icons/mercedes.png"),
    BMW: require("../assets/Icons/bmw.png"),
    Honda: require("../assets/Icons/honda.png"),
    Hyundai: require("../assets/Icons/hyundai.png"),
    Ford: require("../assets/Icons/ford.png"),
    Chevrolet: require("../assets/Icons/chevrolet.png"),
    Toyota: require("../assets/Icons/toyota.png"),
    GMC: require("../assets/Icons/gmc.png"),
    Dodge: require("../assets/Icons/dodge.png"),
    Jeep: require("../assets/Icons/jeep.png"),
    Nissan: require("../assets/Icons/nissan.png"),
    KIA: require("../assets/Icons/kia.png"),
    Subaru: require("../assets/Icons/subaru.png"),
    Volkswagen: require("../assets/Icons/volkswagen.png"),
    Audi: require("../assets/Icons/audi.png"),
    Chrysler: require("../assets/Icons/chrysler.png"),
    Lexus: require("../assets/Icons/lexus.png"),
    Cadilac: require("../assets/Icons/cadilac.png"),
    Buick: require("../assets/Icons/buick.png"),
  };

  const bodyTypeIcons = {
    Sedan: require("../assets/Icons/Sedan.png"),
    Coupe: require("../assets/Icons/Coupe.png"),
    Hatchback: require("../assets/Icons/Hatchback.png"),
    PickupTruck: require("../assets/Icons/PickupTruck.png"),
    SUV: require("../assets/Icons/SUV.png"),
    MiniVan: require("../assets/Icons/MiniVan.png"),
  };

  const getIconSource = (type, value) => {
    if (type === "carBrand") {
      return carBrandIcons[value] || null;
    } else if (type === "bodyType") {
      return bodyTypeIcons[value] || null;
    }
  };

  const markOrderAsCanceled = async (orderId) => {
    try {
      const orderRef = doc(FIRESTORE_DB, "Car-Wash", orderId);
      await setDoc(orderRef, { Status: "Canceled" }, { merge: true });
      console.log("Order marked as Canceled.");
      if (swipeableRef.current) {
        swipeableRef.current.close(); // Close the Swipeable component
      }
      // Update state after canceling the order
      setInProgressOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
      setCanceledOrders((prevOrders) => [
        ...prevOrders,
        inProgressOrders.find((order) => order.id === orderId),
      ]);
    } catch (error) {
      console.error("Error marking order as Canceled:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, [auth]);

  if (!user) {
    return <LogInScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          onPress={() => handleButtonPress("InProgress")}
          style={[
            styles.button,
            highlightedButton === "InProgress" && styles.highlightedButton,
          ]}
          labelStyle={{
            fontSize: 15,
            width: "100%",
            height: "100%",
            textAlign: "center",
            alignSelf: "center",
            verticalAlign: "middle",
          }}
        >
          InProgress
        </Button>
        <Button
          mode="contained"
          onPress={() => handleButtonPress("Completed")}
          style={[
            styles.button,
            highlightedButton === "Completed" && styles.highlightedButton,
          ]}
          labelStyle={{
            fontSize: 15,
            width: "100%",
            height: "100%",
            textAlign: "center",
            alignSelf: "center",
            verticalAlign: "middle",
          }}
        >
          Completed
        </Button>
        <Button
          mode="contained"
          onPress={() => handleButtonPress("Canceled")}
          style={[
            styles.button,
            highlightedButton === "Canceled" && styles.highlightedButton,
          ]}
          labelStyle={{
            fontSize: 15,
            width: "100%",
            height: "100%",
            textAlign: "center",
            alignSelf: "center",
            verticalAlign: "middle",
          }}
        >
          Canceled
        </Button>
      </View>
      {showInProgress && (
        <ScrollView style={styles.ordersList}>
          {inProgressOrders.map((order) => (
            <Swipeable
             key={order.id} // Add key prop here
              ref={swipeableRef}
              rightThreshold={100}
              on
              renderRightActions={() => (
                <View
                  key={order.id}
                  style={{ justifyContent: "center", width: 100 }}
                >
                  <Button
                    mode="contained"
                    onPress={() => markOrderAsCanceled(order.id)}
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      backgroundColor: "#C6373C",
                      borderRadius: 0,
                    }}
                  >
                    Cancel
                  </Button>
                </View>
              )}
            >
              <View style={styles.orderItem}>
                <Text style={{ fontSize: 25 }}>
                  {" "}
                  {order.Preference +
                    " " +
                    "Car Wash" +
                    "   $" +
                    order.Total}{" "}
                </Text>

                <View style={{ flexDirection: "row" }}>
                  {order.BodyType === "Sedan" && (
                    <Icon
                      source={require("../assets/Icons/Sedan.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.BodyType === "Coupe" && (
                    <Icon
                      source={require("../assets/Icons/Coupe.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.BodyType === "Hatchback" && (
                    <Icon
                      source={require("../assets/Icons/Hatchback.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.BodyType === "PickupTruck" && (
                    <Icon
                      source={require("../assets/Icons/PickupTruck.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.BodyType === "SUV" && (
                    <Icon
                      source={require("../assets/Icons/SUV.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.BodyType === "MiniVan" && (
                    <Icon
                      source={require("../assets/Icons/MiniVan.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Mazda" && (
                    <Icon
                      source={require("../assets/Icons/mazda.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Mercedes" && (
                    <Icon
                      source={require("../assets/Icons/mercedes.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "BMW" && (
                    <Icon
                      source={require("../assets/Icons/bmw.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Honda" && (
                    <Icon
                      source={require("../assets/Icons/honda.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Hyundai" && (
                    <Icon
                      source={require("../assets/Icons/hyundai.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Ford" && (
                    <Icon
                      source={require("../assets/Icons/ford.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Chevrolet" && (
                    <Icon
                      source={require("../assets/Icons/chevrolet.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Toyota" && (
                    <Icon
                      source={require("../assets/Icons/toyota.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "GMC" && (
                    <Icon
                      source={require("../assets/Icons/gmc.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Dodge" && (
                    <Icon
                      source={require("../assets/Icons/dodge.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Jeep" && (
                    <Icon
                      source={require("../assets/Icons/jeep.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Nissan" && (
                    <Icon
                      source={require("../assets/Icons/nissan.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "KIA" && (
                    <Icon
                      source={require("../assets/Icons/kia.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Subaru" && (
                    <Icon
                      source={require("../assets/Icons/subaru.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Volkswagen" && (
                    <Icon
                      source={require("../assets/Icons/volkswagen.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Audi" && (
                    <Icon
                      source={require("../assets/Icons/audi.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Chrysler" && (
                    <Icon
                      source={require("../assets/Icons/chrysler.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Lexus" && (
                    <Icon
                      source={require("../assets/Icons/lexus.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Cadilac" && (
                    <Icon
                      source={require("../assets/Icons/cadilac.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Buick" && (
                    <Icon
                      source={require("../assets/Icons/buick.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  <Icon source="format-paint" color={order.Color} size={35} />
                  <Text
                    style={{
                      fontSize: 20,
                      alignSelf: "center",
                      borderWidth: 1,
                      left: 5,
                    }}
                  >
                    {" "}
                    {order.PlateNumber}{" "}
                  </Text>
                  {/* <Text style={{ fontSize: 15, alignSelf: "center" }}>
                    {" "}
                    {order.Delivery}{" "}
                  </Text> */}
                </View>

                {/* Add other fields as needed */}
              </View>
            </Swipeable>
          ))}
        </ScrollView>
      )}
      {showCompleted && (
        <ScrollView style={styles.ordersList}>
          {completedOrders.map((order) => (
            <View
              key={order.id}
              rightButtons={[
                <Button
                  //icon="check"
                  mode="contained"
                  onPress={() => {
                    markOrderAsCanceled(order.id);
                  }}
                  style={{ flex: 1, justifyContent: "center" }}
                  labelStyle={{ textAlign: "left", paddingRight: 250 }}
                >
                  Cancel
                </Button>,
              ]}
            >
              <View style={styles.orderItem}>
                <Text style={{ fontSize: 25 }}>
                  {" "}
                  {order.Preference +
                    " " +
                    "Car Wash" +
                    "   $" +
                    order.Total}{" "}
                </Text>

                <View style={{ flexDirection: "row" }}>
                  {order.BodyType === "Sedan" && (
                    <Icon
                      source={require("../assets/Icons/Sedan.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.BodyType === "Coupe" && (
                    <Icon
                      source={require("../assets/Icons/Coupe.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.BodyType === "Hatchback" && (
                    <Icon
                      source={require("../assets/Icons/Hatchback.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.BodyType === "PickupTruck" && (
                    <Icon
                      source={require("../assets/Icons/PickupTruck.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.BodyType === "SUV" && (
                    <Icon
                      source={require("../assets/Icons/SUV.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.BodyType === "MiniVan" && (
                    <Icon
                      source={require("../assets/Icons/MiniVan.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Mazda" && (
                    <Icon
                      source={require("../assets/Icons/mazda.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Mercedes" && (
                    <Icon
                      source={require("../assets/Icons/mercedes.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "BMW" && (
                    <Icon
                      source={require("../assets/Icons/bmw.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Honda" && (
                    <Icon
                      source={require("../assets/Icons/honda.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Hyundai" && (
                    <Icon
                      source={require("../assets/Icons/hyundai.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Ford" && (
                    <Icon
                      source={require("../assets/Icons/ford.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Chevrolet" && (
                    <Icon
                      source={require("../assets/Icons/chevrolet.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Toyota" && (
                    <Icon
                      source={require("../assets/Icons/toyota.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "GMC" && (
                    <Icon
                      source={require("../assets/Icons/gmc.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Dodge" && (
                    <Icon
                      source={require("../assets/Icons/dodge.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Jeep" && (
                    <Icon
                      source={require("../assets/Icons/jeep.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Nissan" && (
                    <Icon
                      source={require("../assets/Icons/nissan.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "KIA" && (
                    <Icon
                      source={require("../assets/Icons/kia.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Subaru" && (
                    <Icon
                      source={require("../assets/Icons/subaru.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Volkswagen" && (
                    <Icon
                      source={require("../assets/Icons/volkswagen.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Audi" && (
                    <Icon
                      source={require("../assets/Icons/audi.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Chrysler" && (
                    <Icon
                      source={require("../assets/Icons/chrysler.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Lexus" && (
                    <Icon
                      source={require("../assets/Icons/lexus.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Cadilac" && (
                    <Icon
                      source={require("../assets/Icons/cadilac.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  {order.CarBrand === "Buick" && (
                    <Icon
                      source={require("../assets/Icons/buick.png")}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  <Icon source="format-paint" color={order.Color} size={35} />
                  <Text
                    style={{
                      fontSize: 20,
                      alignSelf: "center",
                      borderWidth: 1,
                      left: 5,
                    }}
                  >
                    {" "}
                    {order.PlateNumber}{" "}
                  </Text>
                  {/* <Text style={{ fontSize: 15, alignSelf: "center" }}>
                    {" "}
                    {order.Delivery}{" "}
                  </Text> */}
                </View>

                {/* Add other fields as needed */}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      {showCanceled && (
        <ScrollView style={styles.ordersList}>
          {canceledOrders.map((order) => (
            <View
              key={order.id}
              rightButtons={[
                <Button
                  //icon="check"
                  mode="contained"
                  onPress={() => {
                    markOrderAsCanceled(order.id);
                  }}
                  style={{ flex: 1, justifyContent: "center" }}
                  labelStyle={{ textAlign: "left", paddingRight: 250 }}
                >
                  Cancel
                </Button>,
              ]}
            >
              <View style={styles.orderItem}>
                <Text style={{ fontSize: 25 }}>
                  {" "}
                  {order.Preference +
                    " " +
                    "Car Wash" +
                    "   $" +
                    order.Total}{" "}
                </Text>

                <View style={{ flexDirection: "row" }}>
                  {getIconSource("bodyType", order.BodyType) && (
                    <Icon
                      source={getIconSource("bodyType", order.BodyType)}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}

                  {getIconSource("carBrand", order.CarBrand) && (
                    <Icon
                      source={getIconSource("carBrand", order.CarBrand)}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}

                  <Icon source="format-paint" color={order.Color} size={35} />
                  <Text
                    style={{
                      fontSize: 20,
                      alignSelf: "center",
                      borderWidth: 1,
                      left: 5,
                    }}
                  >
                    {" "}
                    {order.PlateNumber}{" "}
                  </Text>
                  {/* <Text style={{ fontSize: 15, alignSelf: "center" }}>
                 {" "}
                 {order.Delivery}{" "}
               </Text> */}
                </View>

                {/* Add other fields as needed */}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 10,
    alignItems: "center",
    paddingTop: 75,
    paddingHorizontal: 10,
    paddingBottom: 25,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,

    width: 350,
  },
  button: {
    width: 100,
    textAlign: "center",
  },
  highlightedButton: {
    backgroundColor: "#D8BFD8",
  },
  ordersList: {
    width: "100%",
    height: "70%",
    // borderWidth: 2,
    borderColor: "black",
    // marginBottom: 10,
    // backgroundColor: "#D8BFD8",
  },
  orderItem: {
    //padding: 3,

    borderBottomWidth: 3,
    borderBottomColor: "#DDDDDD",
    backgroundColor: "#F3E9F9",
  },
});

export default OrderScreen;
