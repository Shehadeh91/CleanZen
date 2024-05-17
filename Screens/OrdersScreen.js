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
import { Button, Icon, MD3Colors, Divider } from "react-native-paper";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import LogInScreen from "./LogInScreen";
import useAppStore from "../useAppStore";
import { collection, query, getDocs, Firestore } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { Swipeable } from "react-native-gesture-handler";

import { doc, getDoc, setDoc } from "firebase/firestore";

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

        const carWashQuerySnapshot = await getDocs(carWashOrdersRef);
        const dryCleanQuerySnapshot = await getDocs(dryCleanOrdersRef);

        const carWashOrders = carWashQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const dryCleanOrders = dryCleanQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter orders by user's email
        //const userOrders = data.filter((carWashOrder) => carWashOrder.Email === user.email);

       
          // Update state by reversing the carWashOrder of new orders
          const carWashUserOrders = carWashOrders.filter((order) => order.Email === user.email && order.Status === "InProgress" && order.Service === "Car Wash");
      const carWashCanceledOrders = carWashOrders.filter((order) => order.Email === user.email && order.Status === "Canceled" && order.Service === "Car Wash");
      const carWashCompletedOrders = carWashOrders.filter((order) => order.Email === user.email && order.Status === "Completed" && order.Service === "Car Wash");

      // Filter orders by user's email and status for Dry-Clean orders
      const dryCleanUserOrders = dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "InProgress" && order.Service === "Dry Clean");
      const dryCleanCanceledOrders = dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "Canceled" && order.Service === "Dry Clean");
      const dryCleanCompletedOrders = dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "Completed" && order.Service === "Dry Clean");

      
        setInProgressOrders(carWashUserOrders.concat(dryCleanUserOrders));
        setCanceledOrders(carWashCanceledOrders.concat(dryCleanCanceledOrders));
        setCompletedOrders(carWashCompletedOrders.concat(dryCleanCompletedOrders));

          //   setCanceledOrders(
          //     data.filter((carWashOrder) => carWashOrder.Status === "Canceled").reverse()
          //   );
      
      } catch (error) {
        console.error("Error fetching orders:", error);
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
        console.error("User is not logged in or has no email.");
        return;
      }

      const carWashOrdersRef = collection(FIRESTORE_DB, "Car-Wash");
      const dryCleanOrdersRef = collection(FIRESTORE_DB, "Dry-Clean");

      const carWashQuerySnapshot = await getDocs(carWashOrdersRef);
      const dryCleanQuerySnapshot = await getDocs(dryCleanOrdersRef);

      const carWashOrders = carWashQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const dryCleanOrders = dryCleanQuerySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter orders by user's email and status for Car-Wash orders
      const carWashUserOrders = carWashOrders.filter((order) => order.Email === user.email && order.Status === "InProgress" && order.Service === "Car Wash");
      const carWashCanceledOrders = carWashOrders.filter((order) => order.Email === user.email && order.Status === "Canceled" && order.Service === "Car Wash");
      const carWashCompletedOrders = carWashOrders.filter((order) => order.Email === user.email && order.Status === "Completed" && order.Service === "Car Wash");

      // Filter orders by user's email and status for Dry-Clean orders
      const dryCleanUserOrders = dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "InProgress" && order.Service === "Dry Clean");
      const dryCleanCanceledOrders = dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "Canceled" && order.Service === "Dry Clean");
      const dryCleanCompletedOrders = dryCleanOrders.filter((order) => order.Email === user.email && order.Status === "Completed" && order.Service === "Dry Clean");

      if (isMounted) {
        setInProgressOrders(carWashUserOrders.concat(dryCleanUserOrders));
        setCanceledOrders(carWashCanceledOrders.concat(dryCleanCanceledOrders));
        setCompletedOrders(carWashCompletedOrders.concat(dryCleanCompletedOrders));
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

  const markOrderAsCanceled = async (orderId, serviceType) => {
    try {
      if (serviceType === "Dry Clean") {
            const dryCleanOrdersRef = collection(FIRESTORE_DB, "Dry-Clean");
      await setDoc(doc(dryCleanOrdersRef, orderId), { Status: "Canceled" }, { merge: true });
      }else if (serviceType === "Car Wash") {
        const carWashOrdersRef = collection(FIRESTORE_DB, "Car-Wash");
        await setDoc(doc(carWashOrdersRef, orderId), { Status: "Canceled" }, { merge: true });
    
      }else {
        console.error("Invalid service type:", serviceType);
        return;
      }
    
    
      console.log("Order marked as Canceled.");
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
      console.error("Error marking serviceOrder as Canceled:", error);
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
    <View style={styles.container}>
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
                backgroundColor: "#C6373C",
                borderRadius: 0,
              }}
            >
              Cancel
            </Button>
          </View>
        )}
      >
       {serviceOrder.Service === 'Car Wash' && (
        <View style={styles.orderItem}>
       
          <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
            {(serviceOrder.Service).padEnd(20)+ serviceOrder.Total}
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
                fontSize: 20,
                alignSelf: "center",
                borderWidth: 1,
                left: 5,
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
        </View>
      )}
      {serviceOrder.Service === 'Dry Clean' && (
        <View style={styles.orderItem}>
       
          <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
            {(serviceOrder.Service).padEnd(20)+ serviceOrder.Total}
          </Text>
          
          {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{ fontSize: 13, fontFamily: "monospace", marginVertical: 3 }}
                      >
                        {item.title.padEnd( 30 )}{" "}
                        x{item.count}
                      </Text>
                    ))}
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
            {serviceOrder.Service === 'Car Wash' && (
              <View style={styles.orderItem}>
              <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
                  {serviceOrder.Service.padEnd(20) + serviceOrder.Total}
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
                      fontSize: 20,
                      alignSelf: "center",
                      borderWidth: 1,
                      left: 5,
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

                {/* Add other fields as needed */}
              </View>
              )}
               {serviceOrder.Service === 'Dry Clean' && (
        <View style={styles.orderItem}>
       
          <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
            {(serviceOrder.Service).padEnd(20)+ serviceOrder.Total}
          </Text>
          
          {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{ fontSize: 13, fontFamily: "monospace", marginVertical: 3 }}
                      >
                        {item.title.padEnd( 30 )}{" "}
                        x{item.count}
                      </Text>
                    ))}
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
              <View style={styles.orderItem}>
              <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
                  {serviceOrder.Service.padEnd(20) + serviceOrder.Total}
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
                      fontSize: 20,
                      alignSelf: "center",
                      borderWidth: 1,
                      left: 5,
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

                {/* Add other fields as needed */}
              </View>
              )}
               {serviceOrder.Service === 'Dry Clean' && (
        <View style={styles.orderItem}>
       
          <Text style={{ fontSize: 20, fontFamily: "monospace" }}>
            {(serviceOrder.Service).padEnd(20)+ serviceOrder.Total}
          </Text>
          
          {Array.isArray(serviceOrder.Items) &&
                    serviceOrder.Items.map((item, index) => (
                      <Text
                        key={index}
                        style={{ fontSize: 13, fontFamily: "monospace", marginVertical: 3 }}
                      >
                        {item.title.padEnd( 30 )}{" "}
                        x{item.count}
                      </Text>
                    ))}
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

    width: 375,
    
    gap: 25,
  },
  button: {
    width: 110,
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

export default OrderScreen;
