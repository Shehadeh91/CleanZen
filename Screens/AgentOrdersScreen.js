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
  ActivityIndicator,
  Alert,
} from "react-native";
import { Button, Icon, MD3Colors, useTheme } from "react-native-paper";
import { FIREBASE_AUTH, FIREBASE_APP } from "../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import LogInScreen from "./LogInScreen";
import useAppStore from "../useAppStore";
import { collection, query, getDocs, Firestore, Timestamp } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { Swipeable } from "react-native-gesture-handler";

import { doc, getDoc, setDoc } from "firebase/firestore";



const AgentOrdersScreen = () => {
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
  const [showMyOrders, setShowMyOrders] = useState(false);
  // const [showCanceled, setShowCanceled] = useState(false);
  const [highlightedButton, setHighlightedButton] = useState("Available");
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  // const [canceledOrders, setCanceledOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const swipeableRef = useRef(null);

  // const filterOrders = (status) =>
  //   availableOrders.filter((carWashOrder) => carWashOrder.Status === status);
const theme = useTheme();

  const handleButtonPress = (status) => {
    setShowAvailable(status === "Available");
    setShowCompleted(status === "Completed");
    setShowMyOrders(status === "MyOrders");
    // setShowCanceled(status === "Canceled");
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
          ...carWashOrders.filter(
            (serviceOrder) =>
              serviceOrder.Assigned === "No One" &&
              serviceOrder.Status === "InProgress" &&
              serviceOrder.Service === "Car Wash"
          ),
          ...dryCleanOrders.filter(
            (serviceOrder) =>
              serviceOrder.Assigned === "No One" &&
              serviceOrder.Status === "InProgress" &&
              serviceOrder.Service === "Dry Clean"
          ),
          ...roomCleanOrders.filter(
            (serviceOrder) =>
              serviceOrder.Assigned === "No One" &&
              serviceOrder.Status === "InProgress" &&
              serviceOrder.Service === "Room Clean"
          ),
        ]);
        setMyOrders([
          ...carWashOrders.filter(
            (serviceOrder) =>
              serviceOrder.Assigned === user.email &&
              serviceOrder.Status === "InProgress" &&
              serviceOrder.Service === "Car Wash"
          ),
          ...dryCleanOrders.filter(
            (serviceOrder) =>
              serviceOrder.Assigned === user.email &&
              serviceOrder.Status === "InProgress" &&
              serviceOrder.Service === "Dry Clean"
          ),
          ...roomCleanOrders.filter(
            (serviceOrder) =>
              serviceOrder.Assigned === user.email &&
              serviceOrder.Status === "InProgress" &&
              serviceOrder.Service === "Room Clean"
          ),
        ]);
        setCompletedOrders([
          ...carWashOrders.filter(
            (serviceOrder) =>
              serviceOrder.Status === "Completed" &&
              serviceOrder.Assigned === user.email &&
              serviceOrder.Service === "Car Wash"
          ),
          ...dryCleanOrders.filter(
            (serviceOrder) =>
              serviceOrder.Status === "Completed" &&
              serviceOrder.Assigned === user.email &&
              serviceOrder.Service === "Dry Clean"
          ),
          ...roomCleanOrders.filter(
            (serviceOrder) =>
              serviceOrder.Status === "Completed" &&
              serviceOrder.Assigned === user.email &&
              serviceOrder.Service === "Room Clean"
          ),
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
          // Update state by reversing the carWashOrder of new orders
          setAvailableOrders([
            ...carWashOrders.filter(
              (serviceOrder) =>
                serviceOrder.Assigned === "No One" &&
                serviceOrder.Status === "InProgress" &&
                serviceOrder.Service === "Car Wash"
            ),
            ...dryCleanOrders.filter(
              (serviceOrder) =>
                serviceOrder.Assigned === "No One" &&
                serviceOrder.Status === "InProgress" &&
                serviceOrder.Service === "Dry Clean"
            ),
            ...roomCleanOrders.filter(
              (serviceOrder) =>
                serviceOrder.Assigned === "No One" &&
                serviceOrder.Status === "InProgress" &&
                serviceOrder.Service === "Room Clean"
            ),
          ]);
          setMyOrders([
            ...carWashOrders.filter(
              (serviceOrder) =>
                serviceOrder.Assigned === user.email &&
                serviceOrder.Status === "InProgress" &&
                serviceOrder.Service === "Car Wash"
            ),
            ...dryCleanOrders.filter(
              (serviceOrder) =>
                serviceOrder.Assigned === user.email &&
                serviceOrder.Status === "InProgress" &&
                serviceOrder.Service === "Dry Clean"
            ),
            ...roomCleanOrders.filter(
              (serviceOrder) =>
                serviceOrder.Assigned === user.email &&
                serviceOrder.Status === "InProgress" &&
                serviceOrder.Service === "Room Clean"
            ),
          ]);
          setCompletedOrders([
            ...carWashOrders.filter(
              (serviceOrder) =>
                serviceOrder.Status === "Completed" &&
                serviceOrder.Assigned === user.email &&
                serviceOrder.Service === "Car Wash"
            ),
            ...dryCleanOrders.filter(
              (serviceOrder) =>
                serviceOrder.Status === "Completed" &&
                serviceOrder.Assigned === user.email &&
                serviceOrder.Service === "Dry Clean"
            ),
            ...roomCleanOrders.filter(
              (serviceOrder) =>
                serviceOrder.Status === "Completed" &&
                serviceOrder.Assigned === user.email &&
                serviceOrder.Service === "Room Clean"
            ),
          ]);

          //   setCanceledOrders(
          //     data.filter((carWashOrder) => carWashOrder.Status === "Canceled").reverse()
          //   );
        }
      } catch (error) {
        //  console.error("Error fetching orders:", error);
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
    Tesla: require('../assets/Icons/tesla.png'),
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

  const openSmsApp = (phoneNumber, message) => {
    const url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        Alert.alert(
          "Error",
          "Your device does not support sending SMS messages."
        );
      }
    });
    //.catch((error) => console.error('Error opening SMS app:', error));
  };

  const claimOrder = async (orderId, serviceType, clientPhone) => {
    try {
      if (serviceType === "Dry Clean") {
        const dryCleanOrdersRef = collection(FIRESTORE_DB, "Dry-Clean");
        await setDoc(
          doc(dryCleanOrdersRef, orderId),
          { Assigned: user.email },
          { merge: true }
        );
      } else if (serviceType === "Car Wash") {
        const carWashOrdersRef = collection(FIRESTORE_DB, "Car-Wash");
        await setDoc(
          doc(carWashOrdersRef, orderId),
          { Assigned: user.email },
          { merge: true }
        );
      } else if (serviceType === "Room Clean") {
        const roomCleanOrdersRef = collection(FIRESTORE_DB, "Room-Clean");
        await setDoc(
          doc(roomCleanOrdersRef, orderId),
          { Assigned: user.email },
          { merge: true }
        );
      } else {
        // console.error("Invalid service type:", serviceType);
        return;
      }

      // Usage example
      // const phoneNumberToText = '1234567890'; // Replace with your variable
      const messageText = `Thank you for ordering. I am your agent ${name}. I will take care of your ${serviceType} Service. I am on the way!`;

      //openSmsApp(clientPhone,messageText)

      // console.log("Order marked as MyOrders.");
      if (swipeableRef.current) {
        swipeableRef.current.close(); // Close the Swipeable component
      }

      //Update state after canceling the users
      //Remove the carWashOrder from available orders and add it to MyOrders
      setAvailableOrders((prevOrders) =>
        prevOrders.filter((serviceOrder) => serviceOrder.id !== orderId)
      );
      setMyOrders((prevOrders) => [
        // Place the claimed carWashOrder at the top of MyOrders
        {
          id: orderId,
          ...availableOrders.find(
            (serviceOrder) => serviceOrder.id === orderId
          ),
        },
        ...prevOrders.filter((serviceOrder) => serviceOrder.id !== orderId), // Filter out the old carWashOrder if it exists
      ]);
    } catch (error) {
      // console.error("Error marking serviceOrder as MyOrders:", error);
    }
  };
  const markOrderAsComplete = async (orderId, serviceType,serviceTotal, servicePayment) => {
    try {
      if (serviceType === "Dry Clean") {
        const dryCleanOrdersRef = collection(FIRESTORE_DB, "Dry-Clean");
        await setDoc(
          doc(dryCleanOrdersRef, orderId),
          { Status: "Completed" },
          { merge: true }
        );
      } else if (serviceType === "Car Wash") {
        const carWashOrdersRef = collection(FIRESTORE_DB, "Car-Wash");
        await setDoc(
          doc(carWashOrdersRef, orderId),
          { Status: "Completed" },
          { merge: true }
        );
      } else if (serviceType === "Room Clean") {
        const roomCleanOrdersRef = collection(FIRESTORE_DB, "Room-Clean");
        await setDoc(
          doc(roomCleanOrdersRef, orderId),
          { Status: "Completed" },
          { merge: true }
        );
      } else {
        //console.error("Invalid service type:", serviceType);
        return;
      }

      // console.log("Order marked as Completed.");
      if (swipeableRef.current) {
        swipeableRef.current.close(); // Close the Swipeable component
      }
      // Update state after canceling the carWashOrder
      setMyOrders((prevOrders) =>
        prevOrders.filter((serviceOrder) => serviceOrder.id !== orderId)
      );
      setCompletedOrders((prevOrders) => [
        // Place the claimed carWashOrder at the top of MyOrders
        {
          id: orderId,
          ...myOrders.find((serviceOrder) => serviceOrder.id === orderId),
        },
        ...prevOrders.filter((serviceOrder) => serviceOrder.id !== orderId), // Filter out the old carWashOrder if it exists
      ]);
    } catch (error) {
      // console.error("Error marking serviceOrder as Canceled:", error);
    }

    try {
      const user = auth.currentUser;

      const agentDocRef = doc(FIRESTORE_DB, "Agents", user.email);
      const agentDocSnap = await getDoc(agentDocRef);

      let NumberOfServices = 0;
      let TotalEarnings = 0;
      let services = [];

      if (agentDocSnap.exists()) {
        NumberOfServices = agentDocSnap.data().NumberOfServices || 0;

        services = agentDocSnap.data().services || [];
        TotalEarnings = services.reduce((total, service) => total + parseFloat(service.Total || 0), 0);      }

        const newService = {
          Type: serviceType,
          Payment: servicePayment,
          Total: parseFloat(serviceTotal),
          Date: Timestamp.now(),
        };

        services.push(newService);



        TotalEarnings = services.reduce((total, service) => total + parseFloat(service.Total || 0), 0);

      await setDoc(agentDocRef, {
        Email: user.email,
        Name: name,
        Phone: phone,
        Address: address,
        services: services,
        NumberOfServices: NumberOfServices + 1,
        TotalEarnings: TotalEarnings.toFixed(2),
        NetPay: '',
      },
      { merge: true } // This ensures that the document is only updated, not overwritten
    );

  } catch (error) {
    console.error("Error adding Agents Doc:", error);
  }

      };
  const setEstimatedServiceTime = async (orderId, serviceType, setDate) => {
    try {
      if (serviceType === "Dry Clean") {
        // console.log(serviceType)
        const dryCleanOrdersRef = collection(FIRESTORE_DB, "Dry-Clean");
        await setDoc(
          doc(dryCleanOrdersRef, orderId),
          { Note: setDate },
          { merge: true }
        );
      } else if (serviceType === "Car Wash") {
        const carWashOrdersRef = collection(FIRESTORE_DB, "Car-Wash");
        await setDoc(
          doc(carWashOrdersRef, orderId),
          { Note: setDate },
          { merge: true }
        );
      } else {
        // console.error("Invalid service type:", serviceType);
        return;
      }
      // console.log("Order marked as Completed.");
      if (swipeableRef.current) {
        swipeableRef.current.close(); // Close the Swipeable component
      }
      // Update state after canceling the carWashOrder
      setMyOrders((prevOrders) =>
        prevOrders.map((serviceOrder) =>
          serviceOrder.id === orderId
            ? { ...serviceOrder, Note: setDate }
            : serviceOrder
        )
      );

      // setCompletedOrders((prevOrders) => [
      //   // Place the claimed carWashOrder at the top of MyOrders
      //   {
      //     id: orderId,
      //     ...myOrders.find((serviceOrder) => serviceOrder.id === orderId),
      //   },
      //   ...prevOrders.filter((serviceOrder) => serviceOrder.id !== orderId), // Filter out the old carWashOrder if it exists
      // ]);
    } catch (error) {
      // console.error("Error marking serviceOrder as Canceled:", error);
    }
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

  // Define handleOpenMaps function
  const handleOpenMaps = (address) => {
    const formattedAddress = encodeURIComponent(address);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
    Linking.openURL(mapUrl);
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
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
          onPress={() => handleButtonPress("MyOrders")}
          style={[
            styles.button,
            highlightedButton === "MyOrders" && styles.highlightedButton,
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
          My Orders
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
        {/* <Button
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
        </Button> */}
      </View>
      {showAvailable && (
        <ScrollView style={styles.ordersList}>
          {availableOrders.map((serviceOrder) => (
            <Swipeable
              key={serviceOrder.id} // Add key prop here
              ref={swipeableRef}
              rightThreshold={100}
              on
              renderRightActions={() => (
                <View
                  key={serviceOrder.id}
                  style={{ justifyContent: "center", width: 100 }}
                >
                  <Button
                    mode="contained"
                    onPress={() =>
                      claimOrder(
                        serviceOrder.id,
                        serviceOrder.Service,
                        serviceOrder.Phone

                      )
                    }
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      backgroundColor: theme.colors.error,
                      borderRadius: 0,
                      marginVertical: 1,
borderWidth:0.5
                    }}
                  >
                    Claim
                  </Button>
                </View>
              )}
            >
              {serviceOrder.Service === "Car Wash" && (
                <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>
                <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                    {serviceOrder.Service.padEnd(15) +
                      "$".padStart(3)+serviceOrder.Total +
                      "(" +
                      serviceOrder.Payment +
                      ")"}
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
                        borderStyle: "dashed",
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
                     // color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5,
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>

                  {/* <Text
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      fontStyle: "italic",
                      letterSpacing: 1,
                    }}
                  >
                    {" "}
                    Estimated Service Time: {serviceOrder.EstimateTime}
                  </Text> */}
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      fontStyle: "italic",
                      letterSpacing: 1,
                    }}
                  >
                    {" "}
                    Scheduled at: {serviceOrder.Date}
                  </Text>
                </View>
              )}
              {serviceOrder.Service === "Dry Clean" && (
                <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>
                <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                    {serviceOrder.Service.padEnd(15) +
                      "$".padStart(3)+serviceOrder.Total +
                      "(" +
                      serviceOrder.Payment +
                      ")"}
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
                        {item.title.padEnd(37)} x{item.count}
                      </Text>
                    ))}
                  <Text style={{ fontSize: 13, fontStyle: "italic" }}>
                    {serviceOrder.Note}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                     // color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5,
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>
                  {/* <Text
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      fontStyle: "italic",
                      letterSpacing: 1,
                    }}
                  >
                    {" "}
                    Estimated Service Time: {serviceOrder.EstimateTime}
                  </Text> */}
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      fontStyle: "italic",
                      letterSpacing: 1,
                    }}
                  >
                    {" "}
                    Scheduled at: {serviceOrder.Date}
                  </Text>
                </View>
              )}
              {serviceOrder.Service === "Room Clean" && (
                <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>
                <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                    {serviceOrder.Service.padEnd(15) +
                      "$".padStart(3)+serviceOrder.Total +
                      "(" +
                      serviceOrder.Payment +
                      ")"}
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
                        {item.title.padEnd(37)} x{item.count}
                      </Text>
                    ))}
                    <Text style={{marginTop: 5, fontSize: 12, letterSpacing: 1}}> Cleaning Supply: {serviceOrder.Supply}</Text>
                  <Text style={{ fontSize: 13, fontStyle: "italic" }}>
                    {serviceOrder.Note}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      //color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5,
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>
                  {/* <Text
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      fontStyle: "italic",
                      letterSpacing: 1,
                    }}
                  >
                    {" "}
                    Estimated Service Time: {serviceOrder.EstimateTime}
                  </Text> */}

                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      fontStyle: "italic",
                      letterSpacing: 1,
                    }}
                  >
                    {" "}
                    Scheduled at: {serviceOrder.Date}
                  </Text>
                </View>
              )}
            </Swipeable>
          ))}
        </ScrollView>
      )}
      {showCompleted && (
        <ScrollView style={styles.ordersList}>
          {completedOrders.map((serviceOrder) => (
            <View key={serviceOrder.id}>
              {serviceOrder.Service === "Car Wash" && (
                <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>
                <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                    {serviceOrder.Service.padEnd(15) +
                      "$".padStart(3)+serviceOrder.Total +
                      "(" +
                      serviceOrder.Payment +
                      ")"}
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
                        borderStyle: "dashed",
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
                      marginVertical: 5,
                      textDecorationLine: "underline",
                      paddingHorizontal: 5,
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>

                  <Text style={{ fontSize: 12, marginVertical: 5, letterSpacing: 1 }}> Service Rating: {serviceOrder.Rating}</Text>

                </View>
              )}
              {serviceOrder.Service === "Dry Clean" && (
                <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>
                <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                    {serviceOrder.Service.padEnd(15) +
                      "$".padStart(3)+serviceOrder.Total +
                      "(" +
                      serviceOrder.Payment +
                      ")"}
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
                        {item.title.padEnd(37)} x{item.count}
                      </Text>
                    ))}
                  <Text
                    style={{
                      fontSize: 13,
                      marginVertical: 5,
                      textDecorationLine: "underline",
                      paddingHorizontal: 5,
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>

                  <Text style={{ fontSize: 12, marginVertical: 5, letterSpacing: 1 }}> Service Rating: {serviceOrder.Rating}</Text>

                </View>
              )}
              {serviceOrder.Service === "Room Clean" && (
                <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>
                <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                    {serviceOrder.Service.padEnd(15) +
                      "$".padStart(3)+serviceOrder.Total +
                      "(" +
                      serviceOrder.Payment +
                      ")"}
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
                        {item.title.padEnd(37)} x{item.count}
                      </Text>
                    ))}
                    <Text style={{marginTop: 5, fontSize: 12, letterSpacing: 1}}> Cleaning Supply: {serviceOrder.Supply}</Text>
                  <Text
                    style={{
                      fontSize: 13,
                      marginVertical: 5,
                      textDecorationLine: "underline",
                      paddingHorizontal: 5,
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>

                  <Text style={{ fontSize: 12, marginVertical: 5, letterSpacing: 1 }}> Service Rating: {serviceOrder.Rating}</Text>

                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {showMyOrders && (
        <ScrollView style={styles.ordersList}>
          {myOrders.map((serviceOrder) => (
            <Swipeable
              key={serviceOrder.id} // Add key prop here
              ref={swipeableRef}
              rightThreshold={100}
              on
              renderRightActions={() => (
                <View
                  key={serviceOrder.id}
                  style={{ justifyContent: "center", width: 100 }}
                >
                  <Button
                    mode="contained"
                    onPress={() =>
                      markOrderAsComplete(serviceOrder.id, serviceOrder.Service,serviceOrder.Total, serviceOrder.Payment)
                    }
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      backgroundColor: theme.colors.error,
                      borderRadius: 0,
                      marginVertical: 1,
borderWidth:0.5
                    }}
                  >
                    Done
                  </Button>
                </View>
              )}
            >
              {serviceOrder.Service === "Car Wash" && (
                <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>
                <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                    {serviceOrder.Service.padEnd(15) +
                      "$".padStart(3)+serviceOrder.Total +
                      "(" +
                      serviceOrder.Payment +
                      ")"}
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
                        borderStyle: "dashed",
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
                     // color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5,
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>
                  {/* <Text
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      fontStyle: "italic",
                      letterSpacing: 1,
                    }}
                  >
                    {" "}
                    Estimated Service Time: {serviceOrder.EstimateTime}
                  </Text> */}
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      fontStyle: "italic",
                      letterSpacing: 1,
                    }}
                  >
                    {" "}
                    Scheduled at: {serviceOrder.Date}
                  </Text>
                </View>
              )}
              {serviceOrder.Service === "Dry Clean" && (
                <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>
                <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                    {serviceOrder.Service.padEnd(15) +
                      "$".padStart(3)+serviceOrder.Total +
                      "(" +
                      serviceOrder.Payment +
                      ")"}
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
                        {item.title.padEnd(37)} x{item.count}
                      </Text>
                    ))}
                  <Text style={{ fontSize: 13, fontStyle: "italic" }}>
                    {serviceOrder.Note}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                     // color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5,
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>
                  {/* <Text
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      fontStyle: "italic",
                      letterSpacing: 1,
                    }}
                  >
                    {" "}
                    Estimated Service Time: {serviceOrder.EstimateTime}
                  </Text> */}
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      fontStyle: "italic",
                      letterSpacing: 1,
                    }}
                  >
                    {" "}
                    Scheduled at: {serviceOrder.Date}
                  </Text>
                </View>
              )}
              {serviceOrder.Service === "Room Clean" && (
                <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>
                <Text style={{ fontSize: 18, fontFamily: "monospace" }}>
                    {serviceOrder.Service.padEnd(15) +
                      "$".padStart(3)+serviceOrder.Total +
                      "(" +
                      serviceOrder.Payment +
                      ")"}
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
                        {item.title.padEnd(37)} x{item.count}
                      </Text>
                    ))}
                    <Text style={{marginTop: 5, fontSize: 12, letterSpacing: 1}}> Cleaning Supply: {serviceOrder.Supply}</Text>
                  <Text style={{ fontSize: 13, fontStyle: "italic" }}>
                    {serviceOrder.Note}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                     // color: "blue",
                      textDecorationLine: "underline",
                      paddingHorizontal: 5,
                    }}
                    onPress={() => handleOpenMaps(serviceOrder.Address)}
                  >
                    {serviceOrder.Address}
                  </Text>
                  {/* <Text
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      fontStyle: "italic",
                      letterSpacing: 1,
                    }}
                  >
                    {" "}
                    Estimated Service Time: {serviceOrder.EstimateTime}
                  </Text> */}
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: 12,
                      fontStyle: "italic",
                      letterSpacing: 1,
                    }}
                  >
                    {" "}
                    Scheduled at: {serviceOrder.Date}
                  </Text>
                </View>
              )}
            </Swipeable>
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
    paddingTop: 50,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,

    width: 375,

    gap: 25,
  },
  button: {
    width: 110,
    textAlign: "center",
    borderRadius: 0,
  },
  highlightedButton: {
   // backgroundColor: "black",
  },
  ordersList: {
    width: "100%",
    height: "70%",
    // borderWidth: 2,
   // borderColor: "black",
    // marginBottom: 10,
    // backgroundColor: "#D8BFD8",
  },
  orderItem: {
    padding: 3,

    //backgroundColor: '#b3e0ff',
    borderBottomWidth: 0,
marginVertical: 1,
borderWidth:0.5
  },
});

export default AgentOrdersScreen;
