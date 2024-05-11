import React, { useEffect, useState } from "react";
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

  //   firebase()
  //   .collection('Car-Wash')
  //   doc(user)
  //   update({
  //     status: "haha"
  //   })
  //   .then(() => {st
  //     console.log("user updated");
  //   });

  const markOrderAsCanceled = async (orderId) => {
    try {
      const orderRef = doc(FIRESTORE_DB, "Car-Wash", orderId);
      await setDoc(orderRef, { Status: "Canceled" }, { merge: true });
      console.log("Order marked as Canceled.");

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
            fontSize: 18,
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
            fontSize: 18,
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
            fontSize: 18,
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
               
               rightThreshold={100}
            on
              renderRightActions={() => (
                <View
                  key={order.id}
                  style={{  justifyContent: "center", width: 100}}
                 
                >
                
                  <Button
                    mode='contained'
                    onPress={() => markOrderAsCanceled(order.id)}
                    style={{flex: 1,  justifyContent: "center", backgroundColor: '#C6373C', borderRadius: 0 }}
                    
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
                  <Icon source="brightness-1" color={order.Color} size={35} />
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
                  <Icon source="brightness-1" color={order.Color} size={35} />
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
                  <Icon source="brightness-1" color={order.Color} size={35} />
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
    padding: 10,
    alignItems: "center",
    paddingTop: 75,
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
    height: "80%",
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 10,
    // backgroundColor: "#D8BFD8",
  },
  orderItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
   backgroundColor: 'white'
  },
});

export default OrderScreen;
