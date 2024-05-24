import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  BackHandler,
  Linking,
} from "react-native";
import { Button, Icon, MD3Colors } from "react-native-paper";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import LogInScreen from "./LogInScreen";
import useAppStore from "../useAppStore";
import { collection, query, getDocs, Firestore } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { Swipeable } from "react-native-gesture-handler";

import { doc, getDoc, setDoc } from "firebase/firestore";

const AdminOrdersScreen = () => {
  const navigation = useNavigation();
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
  const [orders, setOrders] = useState([]);
  const [showAvailable, setShowAvailable] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showAssigned, setShowAssigned] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);
  const [highlightedButton, setHighlightedButton] = useState("Available");
  const [availableOrders, setAvailableOrders] = useState([]);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  const swipeableRef = useRef(null);

  // const filterOrders = (status) =>
  //   availableOrders.filter((carWashOrder) => carWashOrder.Status === status);

  const handleButtonPress = (status) => {
    setShowAvailable(status === "Available");
    setShowCompleted(status === "Completed");
    setShowAssigned(status === "Assigned");
    setShowCanceled(status === "Canceled");
    setHighlightedButton(status);

    const fetchOrders = async () => {
      try {


        const carWashOrdersRef = collection(FIRESTORE_DB, "Car-Wash");
        const dryCleanOrdersRef = collection(FIRESTORE_DB, "Dry-Clean");
        const roomCleanOrdersRef = collection(FIRESTORE_DB, "Room-Clean");

        const carWashQuerySnapshot = await getDocs(carWashOrdersRef);
        const dryCleanQuerySnapshot = await getDocs(dryCleanOrdersRef);
        const roomCleanQuerySnapshot = await getDocs(roomCleanOrdersRef);

        const carWashOrders = carWashQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const dryCleanOrders = dryCleanQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const roomCleanOrders = roomCleanQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter orders by user's email
        //const userOrders = data.filter((carWashOrder) => carWashOrder.Email === user.email);


          // Update state by reversing the carWashOrder of new orders
          setAvailableOrders([
            ...carWashOrders
              .filter((serviceOrder) => serviceOrder.Assigned === "No One")
              .reverse(),
            ...dryCleanOrders
              .filter((serviceOrder) => serviceOrder.Assigned === "No One")
              .reverse(),
              ...roomCleanOrders
              .filter((serviceOrder) => serviceOrder.Assigned === "No One")
              .reverse(),
          ]);
          setAssignedOrders([
            ...carWashOrders
              .filter((serviceOrder) => serviceOrder.Assigned !== "No One")
              .reverse(),
            ...dryCleanOrders
              .filter((serviceOrder) => serviceOrder.Assigned !== "No One")
              .reverse(),
              ...roomCleanOrders
              .filter((serviceOrder) => serviceOrder.Assigned !== "No One")
              .reverse(),
          ]);
          setCompletedOrders([
            ...carWashOrders
              .filter((serviceOrder) => serviceOrder.Status === "Completed")
              .reverse(),
            ...dryCleanOrders
              .filter((serviceOrder) => serviceOrder.Status === "Completed")
              .reverse(),
              ...roomCleanOrders
              .filter((serviceOrder) => serviceOrder.Status === "Completed")
              .reverse(),
          ]);
          setCanceledOrders([
            ...carWashOrders
              .filter((serviceOrder) => serviceOrder.Status === "Canceled")
              .reverse(),
            ...dryCleanOrders
              .filter((serviceOrder) => serviceOrder.Status === "Completed")
              .reverse(),
              ...roomCleanOrders
              .filter((serviceOrder) => serviceOrder.Status === "Completed")
              .reverse(),
          ]);

          //   setCanceledOrders(
          //     data.filter((carWashOrder) => carWashOrder.Status === "Canceled").reverse()
          //   );

      } catch (error) {
       // console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  };


  useEffect(() => {
    //setVisible(true); // Call setVisible(false) when the component mounts
    const backAction = () => true; // Prevent going back when on AccountScreen
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove(); // Clean up the event listener
  }, []);

  useEffect(() => {
    let isMounted = true; // Flag to track component mount state

    const fetchOrders = async () => {
      try {
        if (!user || !user.email) {
          //console.error("User is not logged in or has no email.");
          return;
        }

        const carWashOrdersRef = collection(FIRESTORE_DB, "Car-Wash");
        const dryCleanOrdersRef = collection(FIRESTORE_DB, "Dry-Clean");
        const roomCleanOrdersRef = collection(FIRESTORE_DB, "Room-Clean");

        const carWashQuerySnapshot = await getDocs(carWashOrdersRef);
        const dryCleanQuerySnapshot = await getDocs(dryCleanOrdersRef);
        const roomCleanQuerySnapshot = await getDocs(roomCleanOrdersRef);

        const carWashOrders = carWashQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const dryCleanOrders = dryCleanQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const roomCleanOrders = roomCleanQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter orders by user's email
        //const userOrders = data.filter((carWashOrder) => carWashOrder.Email === user.email);

        if (isMounted) {
          // Update state by reversing the carWashOrder of new orders
          setAvailableOrders([
            ...carWashOrders
              .filter((serviceOrder) => serviceOrder.Assigned === "No One")
              .reverse(),
            ...dryCleanOrders
              .filter((serviceOrder) => serviceOrder.Assigned === "No One")
              .reverse(),
              ...roomCleanOrders
              .filter((serviceOrder) => serviceOrder.Assigned === "No One")
              .reverse(),
          ]);
          setAssignedOrders([
            ...carWashOrders
              .filter((serviceOrder) => serviceOrder.Assigned !== "No One")
              .reverse(),
            ...dryCleanOrders
              .filter((serviceOrder) => serviceOrder.Assigned !== "No One")
              .reverse(),
              ...roomCleanOrders
              .filter((serviceOrder) => serviceOrder.Assigned !== "No One")
              .reverse(),
          ]);
          setCompletedOrders([
            ...carWashOrders
              .filter((serviceOrder) => serviceOrder.Status === "Completed")
              .reverse(),
            ...dryCleanOrders
              .filter((serviceOrder) => serviceOrder.Status === "Completed")
              .reverse(),
              ...roomCleanOrders
              .filter((serviceOrder) => serviceOrder.Status === "Completed")
              .reverse(),
          ]);
          setCanceledOrders([
            ...carWashOrders
              .filter((serviceOrder) => serviceOrder.Status === "Canceled")
              .reverse(),
            ...dryCleanOrders
              .filter((serviceOrder) => serviceOrder.Status === "Completed")
              .reverse(),
              ...roomCleanOrders
              .filter((serviceOrder) => serviceOrder.Status === "Completed")
              .reverse(),
          ]);
        }
      } catch (error) {
        //console.error("Error fetching orders:", error);
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

  //   const markOrderAsAssigned = async (orderId) => {
  //     try {
  //       const orderRef = doc(FIRESTORE_DB, "Car-Wash", orderId);
  //       await setDoc(orderRef, { Assigned: "Assigned" }, { merge: true });
  //       console.log("Order marked as Assigned.");
  //       if (swipeableRef.current) {
  //         swipeableRef.current.close(); // Close the Swipeable component
  //       }

  //       // Update state after canceling the users
  //       setAvailableOrders((prevOrders) => [...prevOrders, ...assignedOrders]);
  //       setAssignedOrders([]); // Clear the client array after moving all users to agent
  //       // Update state after canceling the carWashOrder
  //     } catch (error) {
  //       console.error("Error marking carWashOrder as Assigned:", error);
  //     }
  //   };
  // Define handleOpenMaps function
  const handleOpenMaps = (address) => {
    const formattedAddress = encodeURIComponent(address);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
    Linking.openURL(mapUrl);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, [auth]);

  if (!user || !user.emailVerified) {
    return <LogInScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Button
          mode="text"
          onPress={() => handleButtonPress("Available")}
          style={[
            styles.button,
            highlightedButton === "Available" && styles.highlightedButton,
          ]}
          labelStyle={{
            fontSize: 13,
            width: "100%",
            height: "100%",
            textAlign: "center",
            alignSelf: "center",
            verticalAlign: "middle",
            letterSpacing: 1,
          }}
        >
          Available
        </Button>

        <Button
          mode="text"
          onPress={() => handleButtonPress("Assigned")}
          style={[
            styles.button,
            highlightedButton === "Assigned" && styles.highlightedButton,
          ]}
          labelStyle={{
            fontSize: 13,
            width: "100%",
            height: "100%",
            textAlign: "center",
            alignSelf: "center",
            verticalAlign: "middle",
            letterSpacing: 1,
          }}
        >
          Assigned
        </Button>
        <Button
          mode="text"
          onPress={() => handleButtonPress("Completed")}
          style={[
            styles.button,
            highlightedButton === "Completed" && styles.highlightedButton,
          ]}
          labelStyle={{
            fontSize: 13,
            width: "100%",
            height: "100%",
            textAlign: "center",
            alignSelf: "center",
            verticalAlign: "middle",
            letterSpacing: 1,
          }}
        >
          Completed
        </Button>
        <Button
          mode="text"
          onPress={() => handleButtonPress("Canceled")}
          style={[
            styles.button,
            highlightedButton === "Canceled" && styles.highlightedButton,
          ]}
          labelStyle={{
            fontSize: 13,
            width: "100%",
            height: "100%",
            textAlign: "center",
            alignSelf: "center",
            verticalAlign: "middle",
            letterSpacing: 1,
          }}
        >
          Canceled
        </Button>
      </View>
      {showAvailable && (
        <ScrollView style={styles.ordersList}>
          {availableOrders.map((serviceOrder) => (
            <View
              key={serviceOrder.id} // Add key prop here
            >
              {serviceOrder.Service === "Car Wash" && (
                <View style={styles.orderItem}>
                  <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                  {serviceOrder.Service.padEnd(15) + serviceOrder.Total.padEnd(5) + "("+serviceOrder.Payment+")"}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 5 }}>
                    {getIconSource("bodyType", serviceOrder.BodyType) && (
                      <Icon
                        source={getIconSource(
                          "bodyType",
                          serviceOrder.BodyType
                        )}
                        // color={MD3Colors.error50}
                        size={35}
                      />
                    )}
                    {getIconSource("carBrand", serviceOrder.CarBrand) && (
                      <Icon
                        source={getIconSource(
                          "carBrand",
                          serviceOrder.CarBrand
                        )}
                        // color={MD3Colors.error50}
                        size={35}
                      />
                    )}
                    <Icon
                      source="format-paint"
                      color={serviceOrder.Color}
                      size={35}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        alignSelf: "center",
                        borderWidth: 1,
                        left: 5,
                        borderStyle: 'dashed'
                      }}
                    >
                      {" "}
                      {serviceOrder.PlateNumber}{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        alignSelf: "center",
                        //borderWidth: 1,
                        left: 5,
                      }}
                    >
                      {" "}
                      {serviceOrder.Preference}{" "}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, fontStyle: "italic" }}>
                    {serviceOrder.Note}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>
                  <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 2}}> Name: {serviceOrder.Name}   Phone: ({serviceOrder.Phone})</Text>
                  <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Estimated Service Time: {serviceOrder.EstimateTime}</Text>
          <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Scheduled at: {serviceOrder.Date}</Text>

                </View>
              )}
              {serviceOrder.Service === "Dry Clean" && (
                <View style={styles.orderItem}>
                  <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                  {serviceOrder.Service.padEnd(15) + serviceOrder.Total.padEnd(5) + "("+serviceOrder.Payment+")"}
                  </Text>

                  {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{
                          fontSize: 13,
                          fontFamily: "monospace",
                          marginVertical: 3,
                        }}
                      >
                        {item.title.padEnd(30)} x{item.count}
                      </Text>
                    ))}

                  <Text style={{ fontSize: 13, fontStyle: "italic" }}>
                    {serviceOrder.Note}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>
                  <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 2}}> Name: {serviceOrder.Name}   Phone: ({serviceOrder.Phone})</Text>
                  <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Estimated Service Time: {serviceOrder.EstimateTime}</Text>
          <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Scheduled at: {serviceOrder.Date}</Text>
                </View>
              )}
              {serviceOrder.Service === "Room Clean" && (
                <View style={styles.orderItem}>
                  <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                  {serviceOrder.Service.padEnd(15) + serviceOrder.Total.padEnd(5) + "("+serviceOrder.Payment+")"}
                  </Text>

                  {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{
                          fontSize: 13,
                          fontFamily: "monospace",
                          marginVertical: 3,
                        }}
                      >
                        {item.title.padEnd(30)} x{item.count}
                      </Text>
                    ))}

                  <Text style={{ fontSize: 13, fontStyle: "italic" }}>
                    {serviceOrder.Note}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>
                  <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 2}}> Name: {serviceOrder.Name}   Phone: ({serviceOrder.Phone})</Text>
                  <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Estimated Service Time: {serviceOrder.EstimateTime}</Text>
          <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Scheduled at: {serviceOrder.Date}</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
      {showCompleted && (
        <ScrollView style={styles.ordersList}>
          {completedOrders.map((serviceOrder) => (
            <View key={serviceOrder.id}>
              {serviceOrder.Service === "Car Wash" && (
                <View style={styles.orderItem}>
                  <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                  {serviceOrder.Service.padEnd(15) + serviceOrder.Total.padEnd(5) + "("+serviceOrder.Payment+")"}
                  </Text>

                  <View style={{ flexDirection: "row", gap: 5 }}>
                    {getIconSource("bodyType", serviceOrder.BodyType) && (
                      <Icon
                        source={getIconSource(
                          "bodyType",
                          serviceOrder.BodyType
                        )}
                        // color={MD3Colors.error50}
                        size={35}
                      />
                    )}

                    {getIconSource("carBrand", serviceOrder.CarBrand) && (
                      <Icon
                        source={getIconSource(
                          "carBrand",
                          serviceOrder.CarBrand
                        )}
                        // color={MD3Colors.error50}
                        size={35}
                      />
                    )}
                    <Icon
                      source="format-paint"
                      color={serviceOrder.Color}
                      size={35}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        alignSelf: "center",
                        borderWidth: 1,
                        left: 5,
                        borderStyle: 'dashed'
                      }}
                    >
                      {" "}
                      {serviceOrder.PlateNumber}{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        alignSelf: "center",
                        //borderWidth: 1,
                        left: 5,
                      }}
                    >
                      {" "}
                      {serviceOrder.Preference}{" "}
                    </Text>
                  </View>

                  <Text
                    style={{
                      fontSize: 13,
                      color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                     {serviceOrder.Address}
                  </Text>

                  <Text style={{ fontSize: 13, color: "red" }}> Agent: {serviceOrder.Assigned} </Text>
                </View>
              )}
              {serviceOrder.Service === "Dry Clean" && (
                <View style={styles.orderItem}>
                  <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                  {serviceOrder.Service.padEnd(15) + serviceOrder.Total.padEnd(5) + "("+serviceOrder.Payment+")"}
                  </Text>

                  {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{
                          fontSize: 13,
                          fontFamily: "monospace",
                          marginVertical: 3,
                        }}
                      >
                        {item.title.padEnd(30)} x{item.count}
                      </Text>
                    ))}
                  <Text
                    style={{
                      fontSize: 13,
                      color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>

                  <Text style={{ fontSize: 13, color: "red" }}> Agent: {serviceOrder.Assigned} </Text>
                </View>
              )}
              {serviceOrder.Service === "Room Clean" && (
                <View style={styles.orderItem}>
                  <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                  {serviceOrder.Service.padEnd(15) + serviceOrder.Total.padEnd(5) + "("+serviceOrder.Payment+")"}
                  </Text>

                  {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{
                          fontSize: 13,
                          fontFamily: "monospace",
                          marginVertical: 3,
                        }}
                      >
                        {item.title.padEnd(30)} x{item.count}
                      </Text>
                    ))}
                  <Text
                    style={{
                      fontSize: 13,
                      color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>

                  <Text style={{ fontSize: 13, color: "red" }}> Agent: {serviceOrder.Assigned} </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
      {showCanceled && (
        <ScrollView style={styles.ordersList}>
          {canceledOrders.map((serviceOrder) => (
            <View key={serviceOrder.id}>
              {serviceOrder.Service === "Car Wash" && (
                <View style={styles.orderItem}>
                  <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                  {serviceOrder.Service.padEnd(15) + serviceOrder.Total.padEnd(5) + "("+serviceOrder.Payment+")"}
                  </Text>

                  <View style={{ flexDirection: "row", gap: 5 }}>
                    {getIconSource("bodyType", serviceOrder.BodyType) && (
                      <Icon
                        source={getIconSource(
                          "bodyType",
                          serviceOrder.BodyType
                        )}
                        // color={MD3Colors.error50}
                        size={35}
                      />
                    )}

                    {getIconSource("carBrand", serviceOrder.CarBrand) && (
                      <Icon
                        source={getIconSource(
                          "carBrand",
                          serviceOrder.CarBrand
                        )}
                        // color={MD3Colors.error50}
                        size={35}
                      />
                    )}
                    <Icon
                      source="format-paint"
                      color={serviceOrder.Color}
                      size={35}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        alignSelf: "center",
                        borderWidth: 1,
                        left: 5,
                        borderStyle: 'dashed'
                      }}
                    >
                      {" "}
                      {serviceOrder.PlateNumber}{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        alignSelf: "center",
                        //borderWidth: 1,
                        left: 5,
                      }}
                    >
                      {" "}
                      {serviceOrder.Preference}{" "}
                    </Text>
                  </View>

                  <Text
                    style={{
                      fontSize: 13,
                      color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>

                  <Text style={{ fontSize: 13, color: "red" }}> Agent: {serviceOrder.Assigned} </Text>
                </View>
              )}
              {serviceOrder.Service === "Dry Clean" && (
                <View style={styles.orderItem}>
                  <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                  {serviceOrder.Service.padEnd(15) + serviceOrder.Total.padEnd(5) + "("+serviceOrder.Payment+")"}
                  </Text>

                  {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{
                          fontSize: 13,
                          fontFamily: "monospace",
                          marginVertical: 3,
                        }}
                      >
                        {item.title.padEnd(30)} x{item.count}
                      </Text>
                    ))}
                  <Text
                    style={{
                      fontSize: 13,
                      color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>

                  <Text style={{ fontSize: 13, color: "red" }}> Agent: {serviceOrder.Assigned} </Text>
                </View>
              )}
              {serviceOrder.Service === "Room Clean" && (
                <View style={styles.orderItem}>
                  <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                  {serviceOrder.Service.padEnd(15) + serviceOrder.Total.padEnd(5) + "("+serviceOrder.Payment+")"}
                  </Text>

                  {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{
                          fontSize: 13,
                          fontFamily: "monospace",
                          marginVertical: 3,
                        }}
                      >
                        {item.title.padEnd(30)} x{item.count}
                      </Text>
                    ))}
                  <Text
                    style={{
                      fontSize: 13,
                      color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>

                  <Text style={{ fontSize: 13, color: "red" }}> Agent: {serviceOrder.Assigned} </Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
      {showAssigned && (
        <ScrollView style={styles.ordersList}>
          {assignedOrders.map((serviceOrder) => (
            <View key={serviceOrder.id}>
              {serviceOrder.Service === "Car Wash" && (
                <View style={styles.orderItem}>
                  <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                  {serviceOrder.Service.padEnd(15) + serviceOrder.Total.padEnd(5) + "("+serviceOrder.Payment+")"}
                  </Text>

                  <View style={{ flexDirection: "row", gap: 5 }}>
                    {getIconSource("bodyType", serviceOrder.BodyType) && (
                      <Icon
                        source={getIconSource(
                          "bodyType",
                          serviceOrder.BodyType
                        )}
                        // color={MD3Colors.error50}
                        size={35}
                      />
                    )}

                    {getIconSource("carBrand", serviceOrder.CarBrand) && (
                      <Icon
                        source={getIconSource(
                          "carBrand",
                          serviceOrder.CarBrand
                        )}
                        // color={MD3Colors.error50}
                        size={35}
                      />
                    )}
                    <Icon
                      source="format-paint"
                      color={serviceOrder.Color}
                      size={35}
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        alignSelf: "center",
                        borderWidth: 1,
                        left: 5,
                        borderStyle: 'dashed'
                      }}
                    >
                      {" "}
                      {serviceOrder.PlateNumber}{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        alignSelf: "center",
                        //borderWidth: 1,
                        left: 5,
                      }}
                    >
                      {" "}
                      {serviceOrder.Preference}{" "}
                    </Text>
                  </View>

                  <Text style={{ fontSize: 13, fontStyle: "italic" }}>
                    {serviceOrder.Note}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>


                  <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 2}}> Name: {serviceOrder.Name}   Phone: ({serviceOrder.Phone})</Text>
                  <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Estimated Service Time: {serviceOrder.EstimateTime}</Text>
          <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Scheduled at: {serviceOrder.Date}</Text>
          <Text style={{ fontSize: 13, color: "red" }}> Agent: {serviceOrder.Assigned} </Text>
                </View>
              )}
              {serviceOrder.Service === "Dry Clean" && (
                <View style={styles.orderItem}>
                  <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                  {serviceOrder.Service.padEnd(15) + serviceOrder.Total.padEnd(5) + "("+serviceOrder.Payment+")"}
                  </Text>

                  {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{
                          fontSize: 13,
                          fontFamily: "monospace",
                          marginVertical: 3,
                        }}
                      >
                        {item.title.padEnd(30)} x{item.count}
                      </Text>
                    ))}
                  <Text style={{ fontSize: 13, fontStyle: "italic" }}>
                    {serviceOrder.Note}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>


                  <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 2}}> Name: {serviceOrder.Name}   Phone: ({serviceOrder.Phone})</Text>
                  <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Estimated Service Time: {serviceOrder.EstimateTime}</Text>
          <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Scheduled at: {serviceOrder.Date}</Text>
          <Text style={{ fontSize: 13, color: "red" }}> Agent: {serviceOrder.Assigned} </Text>
                </View>
              )}
              {serviceOrder.Service === "Room Clean" && (
                <View style={styles.orderItem}>
                  <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                  {serviceOrder.Service.padEnd(15) + serviceOrder.Total.padEnd(5) + "("+serviceOrder.Payment+")"}
                  </Text>

                  {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{
                          fontSize: 13,
                          fontFamily: "monospace",
                          marginVertical: 3,
                        }}
                      >
                        {item.title.padEnd(30)} x{item.count}
                      </Text>
                    ))}
                  <Text style={{ fontSize: 13, fontStyle: "italic" }}>
                    {serviceOrder.Note}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>


                  <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 2}}> Name: {serviceOrder.Name}   Phone: ({serviceOrder.Phone})</Text>
                  <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Estimated Service Time: {serviceOrder.EstimateTime}</Text>
          <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Scheduled at: {serviceOrder.Date}</Text>
                  <Text style={{ fontSize: 13, color: "red" }}> Agent: {serviceOrder.Assigned} </Text>
                </View>
              )}
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

    gap: 25,
  },
  button: {
    width: 90,
    textAlign: "center",
    borderRadius: 0,
  },
  highlightedButton: {
    backgroundColor: "black",
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

export default AdminOrdersScreen;
