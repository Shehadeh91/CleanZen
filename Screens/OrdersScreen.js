import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  BackHandler,


} from "react-native";
import { Button, Icon, MD3Colors, Divider, useTheme, IconButton } from "react-native-paper";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import LogInScreen from "./LogInScreen";
import useAppStore from "../useAppStore";
import { collection, query, getDocs, Firestore, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { Swipeable } from "react-native-gesture-handler";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { Colors } from "react-native/Libraries/NewAppScreen";

const OrderScreen = () => {
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;
  const {name, setName, phone, setPhone, address, setAddress, indexBottom  , setIndexBottom, user, setUser, visible, setVisible, email, setEmail} = useAppStore();
    const [orders, setOrders] = useState([]);
  const [showInProgress, setShowInProgress] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);
  const [highlightedButton, setHighlightedButton] = useState("InProgress");
  const [inProgressOrders, setInProgressOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);



  const swipeableRef = useRef(null);
const theme = useTheme();
  // const filterOrders = (status) => {
  //   const filteredInProgressOrders = inProgressOrders.filter((serviceOrder) => serviceOrder.Status === status);
  //   const filteredDryCleanOrders = inProgressOrders.filter((dryCleanOrder) => dryCleanOrder.Status === status);

  //   return { filteredInProgressOrders, filteredDryCleanOrders };
  // }



  const handleButtonPress = (status) => {
    setShowInProgress(status === "InProgress");
    setShowCompleted(status === "Completed");
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


         // Update state by filtering orders based on service type and status
const userInProgressOrders = [
  ...carWashOrders.filter((order) => order.Email === user.email && order.Status === "InProgress" && order.Service === "Car Wash").reverse(),
  ...dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "InProgress" && order.Service === "Dry Clean").reverse(),
  ...roomCleanOrders.filter((order) => order.Email === user.email && order.Status === "InProgress" && order.Service === "Room Clean").reverse(),
];

const userCanceledOrders = [
  ...carWashOrders.filter((order) => order.Email === user.email && order.Status === "Canceled" && order.Service === "Car Wash").reverse(),
  ...dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "Canceled" && order.Service === "Dry Clean").reverse(),
  ...roomCleanOrders.filter((order) => order.Email === user.email && order.Status === "Canceled" && order.Service === "Room Clean").reverse(),
];

const userCompletedOrders = [
  ...carWashOrders.filter((order) => order.Email === user.email && order.Status === "Completed" && order.Service === "Car Wash").reverse(),
  ...dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "Completed" && order.Service === "Dry Clean").reverse(),
  ...roomCleanOrders.filter((order) => order.Email === user.email && order.Status === "Completed" && order.Service === "Room Clean").reverse(),
];

// Set the state with the filtered orders
setInProgressOrders(userInProgressOrders);
setCanceledOrders(userCanceledOrders);
setCompletedOrders(userCompletedOrders);


          //   setCanceledOrders(
          //     data.filter((carWashOrder) => carWashOrder.Status === "Canceled").reverse()
          //   );

      } catch (error) {
        //console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  };


  useEffect(() => {
    setVisible(true); // Call setVisible(false) when the component mounts
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
       // console.error("User is not logged in or has no email.");
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


          // Update state by filtering orders based on service type and status
const userInProgressOrders = [
  ...carWashOrders.filter((order) => order.Email === user.email && order.Status === "InProgress" && order.Service === "Car Wash"),
  ...dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "InProgress" && order.Service === "Dry Clean"),
  ...roomCleanOrders.filter((order) => order.Email === user.email && order.Status === "InProgress" && order.Service === "Room Clean"),
];

const userCanceledOrders = [
  ...carWashOrders.filter((order) => order.Email === user.email && order.Status === "Canceled" && order.Service === "Car Wash"),
  ...dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "Canceled" && order.Service === "Dry Clean"),
  ...roomCleanOrders.filter((order) => order.Email === user.email && order.Status === "Canceled" && order.Service === "Room Clean"),
];

const userCompletedOrders = [
  ...carWashOrders.filter((order) => order.Email === user.email && order.Status === "Completed" && order.Service === "Car Wash"),
  ...dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "Completed" && order.Service === "Dry Clean"),
  ...roomCleanOrders.filter((order) => order.Email === user.email && order.Status === "Completed" && order.Service === "Room Clean"),
];

      if (isMounted) {
       // Set the state with the filtered orders
setInProgressOrders(userInProgressOrders);
setCanceledOrders(userCanceledOrders);
setCompletedOrders(userCompletedOrders);
      }
    } catch (error) {
     // console.error("Error fetching orders:", error);
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



// Function to set service rating
const markOrderRating = async (orderId, serviceType, rating) => {
  try {
      // Mapping service types to Firestore collection names
      const serviceCollectionMap = {
          "Dry Clean": "Dry-Clean",
          "Car Wash": "Car-Wash",
          "Room Clean": "Room-Clean"
      };

      // Get the collection name based on service type
      const collectionName = serviceCollectionMap[serviceType];
      if (!collectionName) {
          console.error("Invalid service type:", serviceType);
          return;
      }

      // Reference to the appropriate collection
      const ordersRef = collection(FIRESTORE_DB, collectionName);
      const orderDocRef = doc(ordersRef, orderId);
  // Update the Rating field in the specified document
  await updateDoc(orderDocRef, { Rating: rating });
  console.log(`Rating "${rating}" set for order ID "${orderId}" in collection "${collectionName}".`);
handleButtonPress("Completed");
  } catch (error) {
      console.error("Error setting service rating:", error);
  }
};


  const markOrderAsCanceled = async (orderId, serviceType) => {
    try {
      if (serviceType === "Dry Clean") {
            const dryCleanOrdersRef = collection(FIRESTORE_DB, "Dry-Clean");
      await setDoc(doc(dryCleanOrdersRef, orderId), { Status: "Canceled" }, { merge: true });
      }else if (serviceType === "Car Wash") {
        const carWashOrdersRef = collection(FIRESTORE_DB, "Car-Wash");
        await setDoc(doc(carWashOrdersRef, orderId), { Status: "Canceled" }, { merge: true });

      }else if (serviceType === "Room Clean") {
        const roomCleanOrdersRef = collection(FIRESTORE_DB, "Room-Clean");
        await setDoc(doc(roomCleanOrdersRef, orderId), { Status: "Canceled" }, { merge: true });

      }else {
       // console.error("Invalid service type:", serviceType);
        return;
      }





     // console.log("Order marked as Canceled.");
      if (swipeableRef.current) {
        swipeableRef.current.close(); // Close the Swipeable component
      }
      // Update state after canceling the serviceOrder
      setInProgressOrders((prevOrders) =>
        prevOrders.filter((serviceOrder) => serviceOrder.id !== orderId)
      );
      setCanceledOrders((prevOrders) => [
        // Place the claimed serviceOrder at the top of MyOrders
        { id: orderId, ...inProgressOrders.find((serviceOrder) => serviceOrder.id === orderId) },
        ...prevOrders.filter((serviceOrder) => serviceOrder.id !== orderId), // Filter out the old serviceOrder if it exists
      ]);
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

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.buttonsContainer}>
        <Button
          mode="text"
          onPress={() => handleButtonPress("InProgress")}
          style={[
            styles.button,
            highlightedButton === "InProgress" && styles.highlightedButton,
          ]}
          labelStyle={{
            fontSize: 13,
            width: "100%",
            height: "100%",
            textAlign: "center",
            alignSelf: "center",
            verticalAlign: "middle",
            letterSpacing: 3,
          }}
        >
          InProgress
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
            letterSpacing: 3,
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
            letterSpacing: 3,
          }}
        >
          Canceled
        </Button>
      </View>
      {showInProgress && (
  <ScrollView style={styles.ordersList}>
    {inProgressOrders.map((serviceOrder) => (
      <Swipeable
        key={serviceOrder.id} // Add key prop here
        ref={swipeableRef}
        rightThreshold={100}
        on
        renderRightActions={() => (
          <View
            key={serviceOrder.id} // Remove this key prop if not needed
            style={{ justifyContent: "center", width: 100 }}
          >
            <Button
              mode="contained"
              onPress={() => markOrderAsCanceled(serviceOrder.id, serviceOrder.Service)}
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: theme.colors.error,
                borderRadius: 0,
                marginVertical: 1,
                borderWidth: 0.5
              }}
            >
              Cancel
            </Button>

          </View>

        )}
      >
       {serviceOrder.Service === 'Car Wash' && (
        <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>

          <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
            {(serviceOrder.Service).padEnd(20)+ "$"+serviceOrder.Total}
          </Text>
          <View style={{ flexDirection: "row", gap: 5 }}>
            {getIconSource("bodyType", serviceOrder.BodyType) && (
              <Icon
                source={getIconSource("bodyType", serviceOrder.BodyType)}
                // color={MD3Colors.error50}
                size={35}
              />
            )}
            {getIconSource("carBrand", serviceOrder.CarBrand) && (
              <Icon
                source={getIconSource("carBrand", serviceOrder.CarBrand)}
                // color={MD3Colors.error50}
                size={35}
              />
            )}
            <Icon source="format-paint" color={serviceOrder.Color} size={35} />
            <Text
              style={{
                fontSize: 15,
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
                fontSize: 15,
                alignSelf: "center",
                //borderWidth: 1,
                left: 5,
              }}
            >
              {" "}
              {serviceOrder.Preference}{" "}
            </Text>
            <Text
              style={{
                fontSize: 15,
                alignSelf: "center",
                //borderWidth: 1,
                left: 5,
              }}
            >
              {" "}
              {serviceOrder.Package}{" "}
            </Text>
          </View>
          {/* <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Estimated Service Time: {serviceOrder.EstimateTime}</Text> */}
          <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Scheduled at: {serviceOrder.Date}</Text>
        </View>
      )}
      {serviceOrder.Service === 'Dry Clean' && (
        <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>

          <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
            {(serviceOrder.Service).padEnd(20)+ "$"+serviceOrder.Total}
          </Text>

          {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{ fontSize: 13, fontFamily: "monospace", marginVertical: 3 }}
                      >
                        {item.title.padEnd( 37 )}{" "}
                        x{item.count}
                      </Text>
                    ))}
                    {/* <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Estimated Service Time: {serviceOrder.EstimateTime}</Text> */}
          <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Scheduled at: {serviceOrder.Date}</Text>
        </View>

      )}
      {serviceOrder.Service === 'Room Clean' && (
        <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>

          <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
            {(serviceOrder.Service).padEnd(20)+ "$"+serviceOrder.Total}
          </Text>

          {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{ fontSize: 13, fontFamily: "monospace", marginVertical: 3 }}
                      >
                        {item.title.padEnd( 37 )}{" "}
                        x{item.count}
                      </Text>
                    ))}

                    <Text style={{marginTop: 5, fontSize: 12, letterSpacing: 1}}> Cleaning Supply: {serviceOrder.Supply}</Text>
                    <Text style={{marginTop: 5, fontSize: 12, letterSpacing: 1}}> Package: {serviceOrder.Package} Cleaning</Text>
          <Text style={{marginTop: 5, fontSize: 12, fontStyle: 'italic', letterSpacing: 1}}> Scheduled at: {serviceOrder.Date}</Text>
        </View>

      )}
      </Swipeable>

    ))}
    <Text style={{ fontStyle: 'italic', fontSize: 12, color: theme.colors.onBackground }}>To cancel an order, swipe on the card</Text>

  </ScrollView>

)}


      {showCompleted && (
        <ScrollView style={styles.ordersList}>
          {completedOrders.map((serviceOrder) => (
            <View key={serviceOrder.id}>
            {serviceOrder.Service === 'Car Wash' && (
              <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>
              <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
                  {serviceOrder.Service.padEnd(20) + "$"+serviceOrder.Total}
                </Text>

                <View style={{ flexDirection: "row", gap: 5 }}>
                  {getIconSource("bodyType", serviceOrder.BodyType) && (
                    <Icon
                      source={getIconSource("bodyType", serviceOrder.BodyType)}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}

                  {getIconSource("carBrand", serviceOrder.CarBrand) && (
                    <Icon
                      source={getIconSource("carBrand", serviceOrder.CarBrand)}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  <Icon source="format-paint" color={serviceOrder.Color} size={35} />
                  <Text
                    style={{
                      fontSize: 15,
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
                fontSize: 15,
                alignSelf: "center",
                //borderWidth: 1,
                left: 5,
              }}
            >
              {" "}
              {serviceOrder.Preference}{" "}
            </Text>
            <Text
              style={{
                fontSize: 15,
                alignSelf: "center",
                //borderWidth: 1,
                left: 5,
              }}
            >
              {" "}
              {serviceOrder.Package}{" "}
            </Text>
                </View>

                {/* Add other fields as needed */}
                {/* Review Section */}



   {/* Service Review Section */}
   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, marginVertical: 5, letterSpacing: 1 }}> Service Rating: {serviceOrder.Rating}</Text>
              {!['Excellent', 'Fair', 'Poor'].includes(serviceOrder.Rating) && (
                <View style={{ flexDirection: 'row' }}>
                  {['Excellent', 'Fair', 'Poor'].map((rating, index) => (
                    <Button
                      key={index}
                      mode='text'
                      labelStyle={{ fontSize: 15 }}
                      onPress={() => markOrderRating(serviceOrder.id, serviceOrder.Service, rating)}
                    >
                      {rating}
                    </Button>
                  ))}
                </View>
              )}
            </View>




          </View>
        )}
               {serviceOrder.Service === 'Dry Clean' && (
                <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>

          <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
            {(serviceOrder.Service).padEnd(20)+ "$"+serviceOrder.Total}
          </Text>

          {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{ fontSize: 13, fontFamily: "monospace", marginVertical: 3 }}
                      >
                        {item.title.padEnd( 37 )}{" "}
                        x{item.count}
                      </Text>

                    ))}
 {/* Service Review Section */}
 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
 <Text style={{ fontSize: 12, marginVertical: 5, letterSpacing: 1 }}> Service Rating: {serviceOrder.Rating}</Text>

              {!['Excellent', 'Fair', 'Poor'].includes(serviceOrder.Rating) && (
                <View style={{ flexDirection: 'row' }}>
                  {['Excellent', 'Fair', 'Poor'].map((rating, index) => (
                    <Button
                      key={index}
                      mode='text'
                      labelStyle={{ fontSize: 15 }}
                      onPress={() => markOrderRating(serviceOrder.id, serviceOrder.Service, rating)}
                    >
                      {rating}
                    </Button>
                  ))}
                </View>
              )}
            </View>
            </View>
          )}
          {serviceOrder.Service === 'Room Clean' && (
            <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>

          <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
            {(serviceOrder.Service).padEnd(20)+ "$"+serviceOrder.Total}
          </Text>

          {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{ fontSize: 13, fontFamily: "monospace", marginVertical: 3 }}
                      >
                        {item.title.padEnd( 37 )}{" "}
                        x{item.count}
                      </Text>
                    ))}
                    <Text style={{marginTop: 5, fontSize: 12, letterSpacing: 1}}> Cleaning Supply: {serviceOrder.Supply}</Text>
                    <Text style={{marginTop: 5, fontSize: 12, letterSpacing: 1}}> Package: {serviceOrder.Package} Cleaning</Text>

                     {/* Service Review Section */}
   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
   <Text style={{ fontSize: 12, marginVertical: 5, letterSpacing: 1 }}> Service Rating: {serviceOrder.Rating}</Text>

              {!['Excellent', 'Fair', 'Poor'].includes(serviceOrder.Rating) && (
                <View style={{ flexDirection: 'row' }}>
                  {['Excellent', 'Fair', 'Poor'].map((rating, index) => (
                    <Button
                      key={index}
                      mode='text'
                      labelStyle={{ fontSize: 15 }}
                      onPress={() => markOrderRating(serviceOrder.id, serviceOrder.Service, rating)}
                    >
                      {rating}
                    </Button>
                  ))}
                </View>
              )}
            </View>
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
            {serviceOrder.Service === 'Car Wash' && (
              <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>
              <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
                  {serviceOrder.Service.padEnd(20) + "$"+serviceOrder.Total}
                </Text>

                <View style={{ flexDirection: "row", gap: 5 }}>
                  {getIconSource("bodyType", serviceOrder.BodyType) && (
                    <Icon
                      source={getIconSource("bodyType", serviceOrder.BodyType)}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}

                  {getIconSource("carBrand", serviceOrder.CarBrand) && (
                    <Icon
                      source={getIconSource("carBrand", serviceOrder.CarBrand)}
                      // color={MD3Colors.error50}
                      size={35}
                    />
                  )}
                  <Icon source="format-paint" color={serviceOrder.Color} size={35} />
                  <Text
                    style={{
                      fontSize: 15,
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
                fontSize: 15,
                alignSelf: "center",
                //borderWidth: 1,
                left: 5,
              }}
            >
              {" "}
              {serviceOrder.Preference}{" "}
            </Text>
            <Text
              style={{
                fontSize: 15,
                alignSelf: "center",
                //borderWidth: 1,
                left: 5,
              }}
            >
              {" "}
              {serviceOrder.Package}{" "}
            </Text>
                </View>

                {/* Add other fields as needed */}
              </View>
              )}
               {serviceOrder.Service === 'Dry Clean' && (
                <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>

          <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
            {(serviceOrder.Service).padEnd(20)+ "$"+serviceOrder.Total}
          </Text>

          {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{ fontSize: 13, fontFamily: "monospace", marginVertical: 3 }}
                      >
                        {item.title.padEnd( 37 )}{" "}
                        x{item.count}
                      </Text>
                    ))}
            </View>
          )}
          {serviceOrder.Service === 'Room Clean' && (
            <View style={[styles.orderItem,{ backgroundColor: theme.colors.surfaceVariant}]}>

          <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
            {(serviceOrder.Service).padEnd(20)+ "$"+serviceOrder.Total}
          </Text>

          {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{ fontSize: 13, fontFamily: "monospace", marginVertical: 3 }}
                      >
                        {item.title.padEnd( 37 )}{" "}
                        x{item.count}
                      </Text>
                    ))}
                    <Text style={{marginTop: 5, fontSize: 12, letterSpacing: 1}}> Cleaning Supply: {serviceOrder.Supply}</Text>
                    <Text style={{marginTop: 5, fontSize: 12, letterSpacing: 1}}> Package: {serviceOrder.Package} Cleaning</Text>
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
    //borderColor: "black",
    // marginBottom: -20,
    // backgroundColor: "#D8BFD8",

  },
  orderItem: {
    padding: 3,
 //backgroundColor: '#4FC3F7',
    borderBottomWidth: 0,
marginVertical: 1,
borderWidth:0.5

   // borderRadius: 30
    //borderBottomColor: "#DDDDDD",
   // backgroundColor: "#F3E9F9",
  },
});

export default OrderScreen;
