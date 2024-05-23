import React, { useEffect, useState, useRef } from "react";
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
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { LogBox } from "react-native";
import useCarWashStore from "../useCarWashStore";
import BottomSheet from '@gorhom/bottom-sheet';
import useAppStore from "../useAppStore";

import DateTimePickerModal from 'react-native-modal-datetime-picker';

const CarWashOrderScreen = () => {
  const navigation = useNavigation();
  const [text, setText] = useState("");
  const [visibleBrand, setVisibleBrand] = useState(false);
  const [visibleBodyStyle, setVisibleBodyStyle] = useState(false);
  const [visibleColorWheel, setVisibleColorWheel] = useState(false);

  const {
    serviceTime,
    setServiceTime,
    getFormattedDate,
    carBrand,
    setCarBrand,
    bodyStyle,
    setBodyStyle,
    iconBrand,
    setIconBrand,
    iconBodyStyle,
    setIconBodyStyle,
    currentColor,
    setCurrentColor,
    carPlate,
    setCarPlate,
    deliveryCost,
    setDeliveryCost,
    prefrenceCost,
    setPrefrenceCost,
    bodyStyleCost,
    setBodyStyleCost,
    totalCost,
    updateTotalCost,
    note,
    setNote,
    deliveryOption,
    setDeliveryOption,
    prefrenceOption,
    setPrefrenceOption,
    paymentOption,
    setPaymentOption,
    date,
    setDate
  } = useCarWashStore();

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

  const showModalBrand = () => setVisibleBrand(true);

  const hideModalBrand = () => setVisibleBrand(false);

  const showModalBodyStyle = () => setVisibleBodyStyle(true);

  const hideModalBodyStyle = () => setVisibleBodyStyle(false);

  const showModalColorWheel = () => setVisibleColorWheel(true);
  const hideModalColorWheel = () => setVisibleColorWheel(false);

  const auth = FIREBASE_AUTH;


//////////////////////////////////////////////////
const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
// const [selectedDate, setSelectedDate] = useState(null);
 const [mode, setMode] = useState('date');
 const bottomSheetRef = useRef(null);

 const showDatePicker = () => {
   setMode('date');
   setDatePickerVisibility(true);
 };

 const showTimePicker = () => {
   setMode('time');
   setDatePickerVisibility(true);
 };

 const hideDatePicker = () => {
   setDatePickerVisibility(false);
 };

 const handleConfirm = (dateTime) => {
   const formattedDate = dateTime.toLocaleString('default', {
     weekday: 'short',
     month: 'short',
     day: 'numeric',
     hour: 'numeric',
     minute: 'numeric',
     hour12: true,
   });
   setDate(formattedDate);
   hideDatePicker();
   //bottomSheetRef.current?.close();
 };
////////////////////////////////////////


  const addCarWashOrder = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !user.emailVerified) {
        //console.error("Error: User is not authenticated.");
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
        "Car-Wash",
        `${userId}_${orderNumber}`
      );

      LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
      ]);

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
        Total: "$" + totalCost,
        Status: "InProgress",
        Assigned: "No One",
        Service: "Car Wash",
        EstimateTime: serviceTime,
        Date: date
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
          title={
            "Subtotal: $" +
            (bodyStyleCost + prefrenceCost + deliveryCost).toFixed(2)
          }
          style={{ position: "absolute", left: 225 }}
          titleStyle={{ fontSize: 15 }}
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
                <TouchableOpacity onPress={() => navigation.navigate("map")}>
                  <Avatar.Icon {...props} icon="map-marker" size={40} />
                </TouchableOpacity>
              )}
            />
            <View style={{ marginBottom: 5, flex: 1, marginLeft: 15 }}>
              <Text
                style={{
                  fontSize: 13,
                  paddingHorizontal: 10,
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
            <Text style={{ fontSize: 12, textAlign: "center" }}>
              {" "}
              Select your car details by tapping the buttons.
            </Text>
            <View style={styles.buttonContainer}>
            <TouchableOpacity   style={{ width: 90,
    height: 55,
    borderRadius: 15,
       alignContent: 'center',
     // bottom: 8,
       alignItems: 'center',
       alignSelf: 'center',
       
    marginLeft: 30,
    
    //borderWidth: 1,
    
    }}   onPress={showModalBrand}>
      <Icon   source={iconBrand} size={55}  />
    </TouchableOpacity>
            
              <Button
                style={styles.rectangularButton}
                //icon="camera"
                labelStyle={{ fontSize: 60 }}
                contentStyle={{ left: 7 }}
                icon={iconBodyStyle}
                mode="text"
                onPress={showModalBodyStyle}
              >
                {/* Style */}
              </Button>
              <Button
                style={styles.rectangularButton}
                icon="format-paint"
                labelStyle={{ fontSize: 40, color: currentColor }}
                mode="text"
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
              maxLength={9}
              onChangeText={(text) => setCarPlate(text)}
            />
          </Card>
          {/* Preference Card */}
          <Card style={styles.card}>
            <Card.Title
              title="Preference"
              titleStyle={{ fontSize: 20, marginTop: 10 }}
              left={(props) => (
                <Avatar.Icon {...props} icon="car-door" size={40} />
              )}
            />
            {/* <Text style={{fontSize: 20, left: 275, bottom: 50, color: 'green' }}>  $24</Text> */}
            <Text
              style={{
                fontSize: 15,
                left: 240,
                top: 60,
                color: "green",
                position: "absolute",
              }}
            >
              {"+$" + bodyStyleCost * 0.75}
            </Text>
            <RadioButton.Group
              onValueChange={(newValue) => {
                setPrefrenceOption(newValue);

                if (newValue === "Exterior") {
                  setPrefrenceCost(0);
                } else if (newValue === "Interior") {
                  setPrefrenceCost(0);
                } else {
                  setPrefrenceCost(bodyStyleCost * 0.75);
                }
              }}
              value={prefrenceOption}
            >
              <View style={styles.radioContainer}>
                <RadioButton.Item label="Exterior" value="Exterior" />
                <RadioButton.Item label="Interior" value="Interior" />
                <RadioButton.Item label="Int/Ext" value="Int/Ext" />
              </View>
            </RadioButton.Group>
          </Card>

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
                  setServiceTime(60);
                  setDate('Standard');
                  {bottomSheetRef.current?.close()}
                } else if (newValue === "Priority") {
                  setDeliveryCost(3.99);
                  setServiceTime(45);
                  setDate('Urgent');
                  {bottomSheetRef.current?.close()}
                } else if (newValue === "Schedule") {
                  setDeliveryCost(0);
                  {bottomSheetRef.current?.expand()}
                  setServiceTime(0);
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
                  {"45 - 60 min"}
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
                  {"25 - 45 min"}
                </Text>
                <RadioButton.Item
                    label="Schedule"
                    value="Schedule"
                   
                  />
                     <Text
                  style={{
                    fontSize: 13,
                    left: 17,
                    top: 145,
                    color: "grey",
                    position: "absolute",
                  }}
                >
                  {date && date.toString() }
                </Text>
              </View>
            </RadioButton.Group>
          </Card>

          <Button
            style={{ marginBottom: 75, bottom: -10 }}
            mode="contained"
            onPress={() => {
              if (!deliveryOption) {
                Alert.alert(
                  "Error",
                  "Please select a service time before confirming."
                );
                return;
              }
              if (carPlate.trim().length > 0) {
      navigation.navigate("checkOut", {
        addCarWashOrder: addCarWashOrder,
      });
      updateTotalCost(bodyStyleCost + prefrenceCost + deliveryCost);
    } else {
      // Add code to handle the case when there's no input in the TextInput
      alert("Please enter a car plate number.");
    }
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
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['25%', '25%']}
        enablePanDownToClose={true}
        backgroundStyle={{ borderWidth: 2, borderRadius: 25, }}
        
             >
        <View style={{margin: 15, gap: 10, marginTop: 10}} >
        {date && <Text> {date.toString()}</Text>}
        {/* <Text style={styles.buttonText}>Choose Date & Time</Text> */}
       
          <Button  onPress={showDatePicker} mode="contained-tonal">Select Date</Button>
          
          <Button  onPress={showTimePicker} mode="contained-tonal" >Select Time</Button>
         
        </View>
      </BottomSheet>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        
      />
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
                
                gap: 15
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Honda"),
                    setIconBrand(require("../assets/Icons/honda.png"));
                }}
              >
                <Icon source={require("../assets/Icons/honda.png")} size={75} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Hyundai"),
                    setIconBrand(require("../assets/Icons/hyundai.png"));
                }}
              >
                <Icon
                  source={require("../assets/Icons/hyundai.png")}
                  size={75}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Ford"),
                    setIconBrand(require("../assets/Icons/ford.png"));
                }}
              >
                <Icon source={require("../assets/Icons/ford.png")} size={75} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Chevrolet"),
                    setIconBrand(require("../assets/Icons/chevrolet.png"));
                }}
              >
                <Icon
                  source={require("../assets/Icons/chevrolet.png")}
                  size={75}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Toyota"),
                    setIconBrand(require("../assets/Icons/toyota.png"));
                }}
              >
                <Icon
                  source={require("../assets/Icons/toyota.png")}
                  size={75}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("GMC"),
                    setIconBrand(require("../assets/Icons/gmc.png"));
                }}
              >
                <Icon source={require("../assets/Icons/gmc.png")} size={75} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Dodge"),
                    setIconBrand(require("../assets/Icons/dodge.png"));
                }}
              >
                <Icon source={require("../assets/Icons/dodge.png")} size={75} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Jeep"),
                    setIconBrand(require("../assets/Icons/jeep.png"));
                }}
              >
                <Icon source={require("../assets/Icons/jeep.png")} size={75} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Nissan"),
                    setIconBrand(require("../assets/Icons/nissan.png"));
                }}
              >
                <Icon
                  source={require("../assets/Icons/nissan.png")}
                  size={75}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("KIA"),
                    setIconBrand(require("../assets/Icons/kia.png"));
                }}
              >
                <Icon source={require("../assets/Icons/kia.png")} size={75} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Subaru"),
                    setIconBrand(require("../assets/Icons/subaru.png"));
                }}
              >
                <Icon
                  source={require("../assets/Icons/subaru.png")}
                  size={75}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Volkswagen"),
                    setIconBrand(require("../assets/Icons/volkswagen.png"));
                }}
              >
                <Icon
                  source={require("../assets/Icons/volkswagen.png")}
                  size={75}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("BMW"),
                    setIconBrand(require("../assets/Icons/bmw.png"));
                }}
              >
                <Icon source={require("../assets/Icons/bmw.png")} size={75} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Mercedes"),
                    setIconBrand(require("../assets/Icons/mercedes.png"));
                }}
              >
                <Icon
                  source={require("../assets/Icons/mercedes.png")}
                  size={75}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Audi"),
                    setIconBrand(require("../assets/Icons/audi.png"));
                }}
              >
                <Icon source={require("../assets/Icons/audi.png")} size={75} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Chrysler"),
                    setIconBrand(require("../assets/Icons/chrysler.png"));
                }}
              >
                <Icon
                  source={require("../assets/Icons/chrysler.png")}
                  size={75}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Lexus"),
                    setIconBrand(require("../assets/Icons/lexus.png"));
                }}
              >
                <Icon source={require("../assets/Icons/lexus.png")} size={75} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Cadilac"),
                    setIconBrand(require("../assets/Icons/cadilac.png"));
                }}
              >
                <Icon
                  source={require("../assets/Icons/cadilac.png")}
                  size={75}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Mazda"),
                    setIconBrand(require("../assets/Icons/mazda.png"));
                }}
              >
                <Icon source={require("../assets/Icons/mazda.png")} size={75} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      </Portal>
      <Portal>
        <Modal
          visible={visibleBodyStyle}
          onDismiss={hideModalBodyStyle}
          contentContainerStyle={{
            //flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            // margin: 0,
            height: "50%",
            borderWidth: 3,
            margin: 25,
          }}
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
                    setIconBodyStyle(
                      require("../assets/Icons/PickupTruck.png")
                    );
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                bottom: 225,
              }}
            >
              <View style={styles.column}>
                <Text style={styles.text}>Sedan</Text>
                <Text style={styles.text}>Hatchback</Text>
                <Text style={styles.text}>SUV</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.text}>Coupe</Text>
                <Text style={styles.text}>Pickup Truck</Text>
                <Text style={styles.text}>Mini-Van</Text>
              </View>
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

            <View
              style={[
                styles.colorBox,
                { backgroundColor: currentColor }, // Set background color dynamically
              ]}
            ></View>
            <Button
              style={{ marginBottom: 10 }}
              mode="contained-tonal"
              onPress={() => {
                hideModalColorWheel();
              }}
              labelStyle={{
                fontSize: 20,
                textAlignVertical: "center",
                letterSpacing: 2,
              }}
            >
              Confirm Color
            </Button>
          </View>
        </Modal>
      </Portal>
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
    marginTop: 0,
    marginHorizontal: 15,
  },
  rectangularButton: {
    width: 90,
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
     alignItems: "center",
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
    fontSize: 15,
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
  column: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 10,
  },
  text: {
    fontSize: 13,
    marginBottom: 10,

    marginVertical: 50,
  },
});
export default CarWashOrderScreen;
