import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
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
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

import useCarWashStore from "../useCarWashStore";

import useAppStore from "../useAppStore";

const CarWashOrderScreen = () => {
  const navigation = useNavigation();
  const [text, setText] = useState("");
  const [visibleBrand, setVisibleBrand] = useState(false);
  const [visibleBodyStyle, setVisibleBodyStyle] = useState(false);
  const [visibleColorWheel, setVisibleColorWheel] = useState(false);

  const {date, setDate, getFormattedDate, carBrand, setCarBrand ,bodyStyle, setBodyStyle,
     iconBrand, setIconBrand, iconBodyStyle, setIconBodyStyle, currentColor, setCurrentColor,
      carPlate, setCarPlate, deliveryCost, setDeliveryCost, prefrenceCost, setPrefrenceCost,
      bodyStyleCost, setBodyStyleCost, totalCost, updateTotalCost, note, setNote,
      deliveryOption, setDeliveryOption, prefrenceOption, setPrefrenceOption,
      paymentOption, setPaymentOption} = useCarWashStore ();
  
      const {name, setName, phone, setPhone, address, setAddress, indexBottom  , setIndexBottom, user, setUser, visible, setVisible, email, setEmail} = useAppStore();

  const showModalBrand = () => setVisibleBrand(true);

  const hideModalBrand = () => setVisibleBrand(false);

  const showModalBodyStyle = () => setVisibleBodyStyle(true);

  const hideModalBodyStyle = () => setVisibleBodyStyle(false);

  const showModalColorWheel = () => setVisibleColorWheel(true);
  const hideModalColorWheel = () => setVisibleColorWheel(false);

  const auth = FIREBASE_AUTH;

 
 
  
  const addCarWashOrder = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !user.emailVerified) {
        console.error("Error: User is not authenticated.");
        navigation.navigate("login");

        return;
      }

      const userId = user?.email || "UnknownUser";
      if (!userId) {
        console.error("Error: User email is null or undefined.");
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
        "Car-Wash",
        `${userId}_${orderNumber}`
      );

      await setDoc(orderDocRef, {
        Email: userId,
        Name: name,
        Phone: phone,
        Address: address,
        CarBrand: carBrand,
        BodyType: bodyStyle,
        Preference: prefrenceOption, // Update Preference based on selected option
        Color: currentColor,
        PlateNumber: carPlate,
        Payment: paymentOption,
        Note: note,
        Delivery: deliveryOption,
        Total: "$"+totalCost,
        Status: "InProgress",
        Assigned: "No One",
        Service: "Car Wash"
      });

      await setDoc(
        counterDocRef,
        { orderNumber: orderNumber },
        { merge: true }
      );
      console.log(
        "Added car wash order document ID:",
        `${userId}_${orderNumber}`
      );
      navigation.navigate("orderComplete");
    } catch (error) {
      console.error("Error adding car wash order:", error);
    }
  };
  const onColorChange = (color) => {
    if (color !== currentColor) {
      // Only update state if color is different
      setCurrentColor(color);
    }
  };
  useEffect(() => {
    // console.log('Current Color:', currentColor); // Debug logging
    // Any other logic related to color change
  }, [currentColor]);

  return (
    
      <View style={{ flex: 1 }}>
      
      
        <Appbar.Header style={{ height: 50, top: 5 }}>
          <Appbar.Content
            title= {'Subtotal: $'+(bodyStyleCost+prefrenceCost+deliveryCost).toFixed(2)}
            style={{ position: "absolute", left: 225 }}
            titleStyle={{fontSize: 15}}
          />
        </Appbar.Header>
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            {/* Car Location Card */}
            <Card style={styles.card}>
              <Card.Title
                title="Car Location"
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
                title="Car Description"
                titleStyle={{ fontSize: 20, marginTop: 10 }}
                left={(props) => (
                  <Avatar.Icon {...props} icon="car-cog" size={40} />
                )}
              />
             
              <View style={styles.buttonContainer}>
                <Button
                  style={styles.rectangularButton}
                  icon={iconBrand}
                  mode="contained"
                  labelStyle={{ fontSize: 40 }}
                  contentStyle={{ left: 7 }}
                  onPress={showModalBrand}
                >
                                 </Button>
                <Button
                  style={styles.rectangularButton}
                  //icon="camera"
                  labelStyle={{ fontSize: 45 }}
                  contentStyle={{ left: 7 }}
                  icon={iconBodyStyle}
                  mode="contained"
                  onPress={showModalBodyStyle}
                >
                  {/* Style */}
                </Button>
                <Button
                  style={styles.rectangularButton}
                  icon="format-paint"
                  labelStyle={{ fontSize: 35, color: currentColor }}
                  mode="contained"
                  contentStyle={{ left: 7 }}
                  onPress={showModalColorWheel}
                ></Button>
              </View>
              <TextInput
                style={{
                  width: 150,
                  marginBottom: 10,
                  alignSelf: "center",
                  left: 15,
                  borderRadius: 25,
                }}
                label="Car Plate"
                value={carPlate}
                mode="outlined"
                autoCapitalize="characters"
                maxLength={10}
                onChangeText={(text) => setCarPlate(text)}
              />
            </Card>
            {/* Preference Card */}
            <Card style={styles.card}>
              <Card.Title
                title="Preference"
                titleStyle={{ fontSize: 20, marginTop: 10 }}
                left={(props) => (
                  <Avatar.Icon {...props} icon="bathtub" size={40} />
                )}
              />
              {/* <Text style={{fontSize: 20, left: 275, bottom: 50, color: 'green' }}>  $24</Text> */}
              <Text style={{ fontSize: 15, left: 240, top: 60, color: "green", position: 'absolute'}}>
                
                {"+$"+bodyStyleCost * 0.75}
              </Text>
              <RadioButton.Group
                onValueChange={(newValue) => {
                  setPrefrenceOption(newValue);
                 
                  if (newValue === "Exterior") {
                    setPrefrenceCost(0);

                  } else if (newValue === "Interior") {
                    setPrefrenceCost(0);
                    
                  } else {
                    setPrefrenceCost(bodyStyleCost*0.75);
                   
                  }
                }}
                value={prefrenceOption}
              >
                <View style={styles.radioContainer}>
                  <RadioButton.Item label="Exterior" value="Exterior" />
                  <RadioButton.Item label="Interior" value="Interior" />
                  <RadioButton.Item label="Int/Ext" value="Int/Ext"  />
                </View>
              </RadioButton.Group>
            </Card>

            
           
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
               <Text style={{ fontSize: 15, left: 240, top: 60, color: "green", position: 'absolute'}}>
                
                {"+$3.99"}
              </Text>
              <RadioButton.Group
                onValueChange={(newValue) => {
                  setDeliveryOption(newValue);
                  if (newValue === "Standard") {
                    setDeliveryCost(0);
                    setDate("30-45 min");
                  } else if (newValue === "Priority") {
                    setDeliveryCost(3.99);
                    setDate("15-30 min");
                  }
                }}
                value={deliveryOption}
              >
                <View style={styles.radioContainer}>
                  <RadioButton.Item label="Standard" value="Standard" />
                  <RadioButton.Item
                    label="Schedule"
                    value="Schedule"
                    disabled
                  />
                  <RadioButton.Item label="Priority" value="Priority" />
                
                </View>
              </RadioButton.Group>
            </Card>
        
            <Button
              style={{ marginBottom: 75, bottom: -10 }}
              mode="contained"
              onPress={() => { navigation.navigate("checkOut", {
                  addCarWashOrder: addCarWashOrder,
                }); updateTotalCost(bodyStyleCost+prefrenceCost+deliveryCost)}
               
              }
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
        <Portal>
          <Modal
            visible={visibleBrand}
            onDismiss={hideModalBrand}
            contentContainerStyle={styles.modalContainer}
          >
            <ScrollView>
              <Text style={styles.modalHeader}>Choose Your Car Brand</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  icon={require("../assets/Icons/honda.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("Honda"),
                      setIconBrand(require("../assets/Icons/honda.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/hyundai.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("Hyundai"),
                      setIconBrand(require("../assets/Icons/hyundai.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/ford.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("Ford"),
                      setIconBrand(require("../assets/Icons/ford.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/chevrolet.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("Chevrolet"),
                      setIconBrand(require("../assets/Icons/chevrolet.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/toyota.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("Toyota"),
                      setIconBrand(require("../assets/Icons/toyota.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/gmc.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("GMC"),
                      setIconBrand(require("../assets/Icons/gmc.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/dodge.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("Dodge"),
                      setIconBrand(require("../assets/Icons/dodge.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/jeep.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("Jeep"),
                      setIconBrand(require("../assets/Icons/jeep.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/nissan.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("Nissan"),
                      setIconBrand(require("../assets/Icons/nissan.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/kia.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("KIA"),
                      setIconBrand(require("../assets/Icons/kia.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/subaru.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("Subaru"),
                      setIconBrand(require("../assets/Icons/subaru.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/volkswagen.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("Volkswagen"),
                      setIconBrand(require("../assets/Icons/volkswagen.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/bmw.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("BMW"),
                      setIconBrand(require("../assets/Icons/bmw.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/mercedes.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("Mercedes"),
                      setIconBrand(require("../assets/Icons/mercedes.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/audi.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("Audi"),
                      setIconBrand(require("../assets/Icons/audi.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/chrysler.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("Chrysler"),
                      setIconBrand(require("../assets/Icons/chrysler.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/lexus.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("Lexus"),
                      setIconBrand(require("../assets/Icons/lexus.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/cadilac.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("Cadilac"),
                      setIconBrand(require("../assets/Icons/cadilac.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
                <Button
                  icon={require("../assets/Icons/mazda.png")}
                  labelStyle={{ fontSize: 50 }}
                  mode="contained"
                  onPress={() => {
                    hideModalBrand(),
                      setCarBrand("Mazda"),
                      setIconBrand(require("../assets/Icons/mazda.png"));
                  }}
                  style={{
                    margin: 20,
                    width: 100,
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 15,
                  }}
                ></Button>
              </View>
            </ScrollView>
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={visibleBodyStyle}
            onDismiss={hideModalBodyStyle}
            contentContainerStyle={{  //flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    // margin: 0,
    height: "50%",
    borderWidth:3,
   margin: 25}}
          >
          <ScrollView>
            <Text style={styles.modalHeader}>Choose Your Car Body Style</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                flexWrap: "wrap",

                
              }}
            >
              <Button
                icon={require("../assets/Icons/Sedan.png")}
                labelStyle={{ fontSize: 75 }}
                mode="contained"
                onPress={() => {
                  hideModalBodyStyle(),
                    setBodyStyleCost(25),
                    setBodyStyle("Sedan"),
                    setIconBodyStyle(require("../assets/Icons/Sedan.png"));
                }}
                style={{
                  marginVertical: 15,
                 width: 130,
                  height: 50,
                  justifyContent: "center",
                 // alignItems: "center",
                  //paddingLeft: 15,
                  //borderWidth: 1,
                 // borderColor: 'red'
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    color: "white",
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  $25
                </Text>
              </Button>
              <Button
                icon={require("../assets/Icons/Coupe.png")}
                labelStyle={{ fontSize: 75 }}
                mode="contained"
                onPress={() => {
                  hideModalBodyStyle(),
                    setBodyStyleCost(25),
                    setBodyStyle("Coupe"),
                    setIconBodyStyle(require("../assets/Icons/Coupe.png"));
                }}
                style={{
                  marginVertical: 15,
                 width: 130,
                  height: 50,
                  justifyContent: "center",
                 // alignItems: "center",
                  //paddingLeft: 15,
                  //borderWidth: 1,
                 // borderColor: 'red'
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    color: "white",
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  $25
                </Text>
              </Button>
              <Button
                icon={require("../assets/Icons/Hatchback.png")}
                labelStyle={{ fontSize: 75 }}
                mode="contained"
                onPress={() => {
                  hideModalBodyStyle(),
                    setBodyStyleCost(30),
                    setBodyStyle("Hatchback"),
                    setIconBodyStyle(require("../assets/Icons/Hatchback.png"));
                }}
                style={{
                  marginVertical: 15,
                 width: 130,
                  height: 50,
                  justifyContent: "center",
                 // alignItems: "center",
                  //paddingLeft: 15,
                  //borderWidth: 1,
                 // borderColor: 'red'
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    color: "white",
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  $30
                </Text>
              </Button>
              <Button
                icon={require("../assets/Icons/PickupTruck.png")}
                labelStyle={{ fontSize: 75 }}
                mode="contained"
                onPress={() => {
                  hideModalBodyStyle(),
                    setBodyStyleCost(40),
                    setBodyStyle("PickupTruck"),
                    setIconBodyStyle(require("../assets/Icons/PickupTruck.png"));
                }}
                style={{
                  marginVertical: 15,
                 width: 130,
                  height: 50,
                  justifyContent: "center",
                 // alignItems: "center",
                  //paddingLeft: 15,
                  //borderWidth: 1,
                 // borderColor: 'red'
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    color: "white",
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  $40
                </Text>
              </Button>
              <Button
                icon={require("../assets/Icons/SUV.png")}
                labelStyle={{ fontSize: 75 }}
                mode="contained"
                onPress={() => {
                  hideModalBodyStyle(),
                    setBodyStyleCost(50),
                    setBodyStyle("SUV"),
                    setIconBodyStyle(require("../assets/Icons/SUV.png"));
                }}
                style={{
                  marginVertical: 15,
                 width: 130,
                  height: 50,
                  justifyContent: "center",
                 // alignItems: "center",
                  //paddingLeft: 15,
                  //borderWidth: 1,
                 // borderColor: 'red'
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    color: "white",
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  $50
                </Text>
              </Button>
              <Button
                icon={require("../assets/Icons/MiniVan.png")}
                labelStyle={{ fontSize: 75 }}
                mode="contained"
                onPress={() => {
                  hideModalBodyStyle(),
                    setBodyStyleCost(65),
                    setBodyStyle("MiniVan"),
                    setIconBodyStyle(require("../assets/Icons/MiniVan.png"));
                }}
                style={{
                 marginVertical: 15,
                 width: 130,
                  height: 50,
                  justifyContent: "center",
                 // alignItems: "center",
                  //paddingLeft: 15,
                  //borderWidth: 1,
                 // borderColor: 'red'
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    color: "white",
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  $65
                </Text>
              </Button>
            </View>
            </ScrollView>
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={visibleColorWheel}
            onDismiss={hideModalColorWheel}
            contentContainerStyle={styles.modalContainerColorWheel}
          >
            <View style={styles.colorPickerContainer}>
              <Text style={styles.modalHeader}>Choose Your Car Color</Text>
              {/* Updated ColorPicker component */}
              <ColorPicker
                style={{ width: 300, top: 50 }}
                color={currentColor} // Use currentColor state as the color value
                onColorChange={onColorChange} // Pass the onColorChange function
                thumbSize={25}
                sliderSize={40}
                row={false}
                useNativeDriver={false}
                useNativeLayout={false}
                shadeWheelThumb={false}
                //shadeSliderThumb={false}

                swatches={true}
                sliderHidden={true}
                discretes={true}
                // noSnap={true}

                palette={[
                  "#000000",
                  "#888888",
                  "#ed1c24",
                  "#d11cd5",
                  "#1633e6",
                  "#00aeef",
                  "#00c85d",
                  "#57ff0a",
                  "#ffde17",
                  "#f26522",
                ]}
              />
              {/* Colored box to display selected color */}
              <View
                style={[
                  styles.colorBox,
                  { backgroundColor: currentColor }, // Set background color dynamically
                ]}
              ></View>
            </View>
          </Modal>
        </Portal>
      </View>
    
  );
};

const styles = StyleSheet.create({
    scrollView: {
      flexDirection: 'column',
      flex: 1
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
   margin: 25
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
export default CarWashOrderScreen;
