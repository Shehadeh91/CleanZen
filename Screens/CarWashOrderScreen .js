import React, { useEffect, useState, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Dimensions,
  FlatList
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
  Dialog,
  useTheme
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { LogBox } from "react-native";
import useCarWashStore from "../useCarWashStore";
import BottomSheet from "@gorhom/bottom-sheet";
import useAppStore from "../useAppStore";

import DateTimePickerModal from "react-native-modal-datetime-picker";


const { width, height } = Dimensions.get('window');
const commonColors = [
  "#FFFFFF", // White
  "#000000", // Black
  "#808080", // Gray
  "#C0C0C0", // Silver
  "#0000FF", // Blue
  "#FF0000", // Red
  "#8B4513", // Brown
  "#008000", // Green
  "#FFA500", // Orange
  "#A52A2A", // Maroon
  "#FFD700", // Gold
  "#00FFFF"  // Cyan
];



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
    packageCost,
    setPackageCost,
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
    packageOption,
    setPackageOption,
    prefrenceOption,
    setPrefrenceOption,
    paymentOption,
    setPaymentOption,
    date,
    setDate,
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
userID,
setUserID,
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

  const [visibleDialog, setVisibleDialog] = useState(false);

  const showDialog = () => setVisibleDialog(true);
  const hideDialog = () => setVisibleDialog(false);

  const theme = useTheme();
  //////////////////////////////////////////////////
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  // const [selectedDate, setSelectedDate] = useState(null);
  const [mode, setMode] = useState("date");
  const bottomSheetRef = useRef(null);

  const showDatePicker = () => {
    setMode("date");
    setDatePickerVisibility(true);

  };
  const carBrandIcons = {
    Mazda: require('../assets/Icons/mazda.png'),
    Mercedes: require('../assets/Icons/mercedes.png'),
    BMW: require('../assets/Icons/bmw.png'),
    Honda: require('../assets/Icons/honda.png'),
    Hyundai: require('../assets/Icons/hyundai.png'),
    Ford: require('../assets/Icons/ford.png'),
    Chevrolet: require('../assets/Icons/chevrolet.png'),
    Toyota: require('../assets/Icons/toyota.png'),
    GMC: require('../assets/Icons/gmc.png'),
    Dodge: require('../assets/Icons/dodge.png'),
    Jeep: require('../assets/Icons/jeep.png'),
    Nissan: require('../assets/Icons/nissan.png'),
    KIA: require('../assets/Icons/kia.png'),
    Subaru: require('../assets/Icons/subaru.png'),
    Volkswagen: require('../assets/Icons/volkswagen.png'),
    Audi: require('../assets/Icons/audi.png'),
    Chrysler: require('../assets/Icons/chrysler.png'),
    Lexus: require('../assets/Icons/lexus.png'),
    Cadilac: require('../assets/Icons/cadilac.png'),
    Buick: require('../assets/Icons/buick.png'),
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

  const bodyStyleCosts = {
    Sedan: 35,
    Coupe: 35,
    Hatchback: 35,
    PickupTruck: 40,
    SUV: 40,
    MiniVan: 50,
  };


const user = auth.currentUser;
  useEffect(() => {
    const fetchUserData = async () => {

      if (user && user.email) {
        try {
          const docRef = doc(FIRESTORE_DB, 'Users', user.email); // Get the document reference
          const docSnap = await getDoc(docRef); // Fetch the document

          if (docSnap.exists()) {
            const data = docSnap.data();
            //setUserData(data); // Set user data
           setAddress(data.Address); // Set address state
           setCarPlate(data.PlateNumber);
           setBodyStyle(data.CarBody);
           setCarBrand(data.CarBrand);

             //setBodyStyle(data.CarBody);
             //setIconBodyStyle(data.CarBodyIcon);
            // setCarBrand(data.CarBrand);
             setCurrentColor(data.CarColor);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    // Update iconBrand, bodyStyleCost, and iconBodyStyle based on carBrand and bodyStyle
    setIconBrand(carBrandIcons[carBrand] || require('../assets/Icons/mazda.png')); // Default icon for car brand
    setBodyStyleCost(bodyStyleCosts[bodyStyle] || 25); // Default cost for body style
    setIconBodyStyle(bodyTypeIcons[bodyStyle] || require('../assets/Icons/Sedan.png')); // Default icon for body style
  }, [carBrand, bodyStyle]);

  const handleUpdateInfo = async () => {

    const user = auth.currentUser;

    try {

      const userDocRef = doc(FIRESTORE_DB, "Users", user.email );

      await updateDoc(userDocRef, {
        PlateNumber: carPlate,
        CarColor: currentColor,
        CarBody: bodyStyle,
        CarBrand:carBrand

       });
     // console.log('User address updated successfully');
    } catch (error) {
     // console.error('Error updating user address: ', error);
    }
  };

  useEffect(() => {
   setDate();
   setVisible(false);
   setPackageOption("Basic");
    setPrefrenceOption("Exterior");
    setPrefrenceCost(0);
    setPackageCost(0);
 }, []);
 useEffect(() => {
  setDeliveryOption();
}, []);
  const showTimePicker = () => {
    setMode("time");
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (dateTime) => {
    const now = new Date();

    const formattedDate = dateTime.toLocaleString("default", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
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
       // console.error("Error: User is not authenticated.");
        navigation.navigate("login");

        return;
      }

      const userId = user?.email || "UnknownUser";
      if (!userId) {
      //  console.error("Error: User email is null or undefined.");
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
        "Non-serializable values were found in the navigation state",
      ]);

      await setDoc(orderDocRef, {
        Email: userId,
        Name: name,
                Phone: phone,
        Address: address,
        CarBrand: carBrand,
        BodyType: bodyStyle,
        Preference: prefrenceOption, // Update Preference based on selected option
        Package: packageOption, // Update Preference based on selected option
        Color: currentColor,
        PlateNumber: carPlate,
        Payment: paymentOption,
        Note: note,
        Delivery: deliveryOption,
        Total: ((bodyStyleCost + prefrenceCost + packageCost + deliveryCost + 4 + ((bodyStyleCost + prefrenceCost + packageCost + deliveryCost + 4)* 0.05)).toFixed(2)),
        Status: "InProgress",
        Assigned: "No One",
        Service: "Car Wash",
        EstimateTime: serviceTime,
        Date: date,
      });

      await setDoc(
        counterDocRef,
        { orderNumber: orderNumber },
        { merge: true }
      );

      navigation.navigate("orderComplete");
    } catch (error) {
     // console.error("Error adding car wash order:", error);
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


  const handleColorSelect = (color) => {
    setCurrentColor(color);
    hideModalColorWheel();
  };

  const renderColorItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.colorCircle, { backgroundColor: item }]}
      onPress={() => handleColorSelect(item)}
    />
  );


  const handlePreferenceChange = (newValue) => {
    let updatedPreferenceCost;

    if (newValue === "Exterior" || newValue === "Interior") {
      updatedPreferenceCost = 0;
    } else if (newValue === "Int/Ext") {
      updatedPreferenceCost = bodyStyleCost * 0.75;
    }

    setPrefrenceCost(updatedPreferenceCost);
    updatePackageCost(packageOption, updatedPreferenceCost);
  };
  const handlePackageChange = (newValue) => {
    setPackageOption(newValue);
    updatePackageCost(newValue, prefrenceCost);
  };
  const updatePackageCost = (packageOption, preferenceCost) => {
    let updatedPackageCost;

    if (packageOption === "Basic") {
      updatedPackageCost = 0;
    } else if (packageOption === "Detailing") {
      updatedPackageCost = (bodyStyleCost + preferenceCost) * 1.5;
    }

    setPackageCost(updatedPackageCost);
  };



  return (
    <View style={{ flex: 1}}>
      <Appbar.Header style={{ height: 50, top: 5 }}>
        <Appbar.Content
          title={
            "Subtotal: $" +
            (bodyStyleCost + prefrenceCost + packageCost + deliveryCost).toFixed(2)
          }
          style={{ position: "absolute", left: 215 }}
          titleStyle={{ fontSize: 15 }}
        />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
          {/* Car Location Card */}
          <TouchableOpacity onPress={() => navigation.navigate("map")}>
          <Card style={[styles.card, {borderColor: theme.colors.onBackground}]}>
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
                 // color: "blue",
                }}
                multiline={true}
                onPress={() => navigation.navigate("map")}
              >
                {address}
              </Text>
            </View>
          </Card>
          </TouchableOpacity>
          <Card style={[styles.card, {borderColor: theme.colors.onBackground}]}>
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
              <TouchableOpacity
                style={{
                  width: 90,
                  height: 55,
                  borderRadius: 15,
                  alignContent: "center",
                  // bottom: 8,
                  alignItems: "center",
                  alignSelf: "center",

                  marginLeft: 30,

                  //borderWidth: 1,
                }}
                onPress={showModalBrand}
              >
                <Icon source={iconBrand} size={55} />
              </TouchableOpacity>

              <Button
                style={styles.rectangularButton}
                //icon="camera"
                labelStyle={{ fontSize: 60 }}
                contentStyle={{ left: 7 }}
                icon={iconBodyStyle}
                mode="text"
                onPress={() => {
    showModalBodyStyle();
    setPackageOption("Basic");
    setPrefrenceOption("Exterior");
    setPrefrenceCost(0);
    setPackageCost(0);
  }}              >
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
          <Card style={[styles.card, {borderColor: theme.colors.onBackground}]}>
            <Card.Title
              title="Preference"
              titleStyle={{ fontSize: 20, marginTop: 10 }}
              left={(props) => (
                <Avatar.Icon {...props} icon="car-door" size={40} />
              )}
            />
            {/* <Text style={{fontSize: 20, left: 275, bottom: 50, color: 'green' }}>  $24</Text> */}

            <RadioButton.Group
              onValueChange={(newValue) => {
                setPrefrenceOption(newValue);

               handlePreferenceChange(newValue);
              }}
              value={prefrenceOption}
            >
              <View style={styles.radioContainer}>
                <RadioButton.Item label="Exterior" value="Exterior" />
                <Text
                  style={{
                    fontSize: 13,
                    left: 17,
                    top: 37,
                    color: "green",
                    position: "absolute",
                  }}
                >
                  {"+$"+0}
                </Text>
                <RadioButton.Item label="Interior" value="Interior" />
                <Text
                  style={{
                    fontSize: 13,
                    left: 17,
                    top: 90,
                    color: "green",
                    position: "absolute",
                  }}
                >
                 {"+$"+0}
                </Text>
                <RadioButton.Item label="Int/Ext" value="Int/Ext" />
                <Text
                  style={{
                    fontSize: 13,
                    left: 17,
                    top: 143,
                    color: "green",
                    position: "absolute",
                  }}
                >
                  {"+$"+(bodyStyleCost * 0.75).toFixed(2)}
                </Text>
              </View>
            </RadioButton.Group>
          </Card>
           {/* Package Card */}
           <Card style={[styles.card, {borderColor: theme.colors.onBackground}]}>
            <Card.Title
              title="Select Your Package"
              titleStyle={{ fontSize: 20, marginTop: 10 }}
              left={(props) => (
                <Avatar.Icon {...props} icon="package" size={40} />
              )}
              right={() => (
            <TouchableOpacity
              style={styles.infoButton}
              onPressIn={showDialog}
              onPressOut={hideDialog}
            >
              <Avatar.Icon icon="information-variant" size={30} />
            </TouchableOpacity>
          )}
            />
            {/* <Text style={{fontSize: 20, left: 275, bottom: 50, color: 'green' }}>  $24</Text> */}

            <RadioButton.Group
              onValueChange={(newValue) => {
                setPackageOption(newValue);

                handlePackageChange(newValue);
              }}
              value={packageOption}
            >
              <View style={styles.radioContainer}>
                <RadioButton.Item label="Basic Clean" value="Basic" />
                <Text
                  style={{
                    fontSize: 13,
                    left: 17,
                    top: 37,
                    color: "green",
                    position: "absolute",
                  }}
                >
                  {"+$"+0}
                </Text>
                <RadioButton.Item label="Premium Detailing" value="Detailing" />
                <Text
                  style={{
                    fontSize: 13,
                    left: 17,
                    top: 90,
                    color: "green",
                    position: "absolute",
                  }}
                >
                 {"+$"+((bodyStyleCost + prefrenceCost) * 1.5).toFixed(2)}
                </Text>
                {/* <RadioButton.Item label="Int/Ext" value="Int/Ext" />
                <Text
                  style={{
                    fontSize: 13,
                    left: 17,
                    top: 143,
                    color: "green",
                    position: "absolute",
                  }}
                >
                  {"$"+(bodyStyleCost + (bodyStyleCost * 0.75))}
                </Text> */}
              </View>
            </RadioButton.Group>
          </Card>
          <Card style={[styles.card, {borderColor: theme.colors.onBackground}]}>
            <Card.Title
               title="Add Additional Note"
              titleStyle={{ fontSize: 20, marginTop: 10 }}
              left={(props) => (
                <Avatar.Icon {...props} icon="note" size={40} />
              )}
            />
            {/* <Text style={{fontSize: 20, left: 275, bottom: 50, color: 'green' }}>  $24</Text> */}

            <Card.Content
              style={{ marginHorizontal: 50, marginTop: -15 }}
            >
              <TextInput
                //label="Address"
                value={note}
                mode="outlined"
               // borderColor="red"
                // borderWidth = {2}
                style={{width: 250 }}

                onChangeText={(text) => setNote(text)}
                // width={200}
              />
            </Card.Content>
          </Card>
          <Card style={[styles.card, {borderColor: theme.colors.onBackground}]}>
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
                  setDate("Standard");
                  {
                    bottomSheetRef.current?.close();
                  }
                } else if (newValue === "Priority") {
                  setDeliveryCost(3.99);
                  setServiceTime(45);
                  setDate("Urgent");
                  {
                    bottomSheetRef.current?.close();
                  }
                } else if (newValue === "Schedule") {
                  setDeliveryCost(0);
                  {
                    bottomSheetRef.current?.expand();
                  }
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
                {/* <RadioButton.Item label="Standard" value="Standard" />
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
                {/* <RadioButton.Item label="Priority" value="Priority" />
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
                </Text>  */}
                <RadioButton.Item label="Schedule" value="Schedule" />
                <Text
                  style={{
                    fontSize: 13,
                    left: 17,
                    top: 40,
                   // color: "grey",
                    position: "absolute",
                  }}
                >
                  {date && date.toString()}
                </Text>
              </View>
            </RadioButton.Group>
          </Card>

          <Button
            style={{ marginBottom: 50, top: 25, backgroundColor: theme.colors.primary }}
            mode="contained"
            onPress={() => {
              if (!deliveryOption) {
                Alert.alert(
                  "Error",
                  "Please select a service time before confirming."
                );
                return;
              }
              if (!date) { // Check if date is not set
      Alert.alert(
        "Error",
        "Please select a date before confirming."
      );
      return;
    }
              if (carPlate.trim().length > 0) {
                navigation.navigate("checkOut", {
                  addCarWashOrder: addCarWashOrder,
                });
                updateTotalCost(bodyStyleCost + prefrenceCost + deliveryCost);
                handleUpdateInfo();
              } else {
                // Add code to handle the case when there's no input in the TextInput
                alert("Please enter a car plate number.");
              }
            }}
            labelStyle={{
              fontSize: 20,
              textAlignVertical: "center",
              //letterSpacing: 10,
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
        snapPoints={["25%", "25%"]}
        enablePanDownToClose={true}
        backgroundStyle={{ borderWidth: 2, borderRadius: 25, backgroundColor: theme.colors.surfaceVariant,  borderColor: theme.colors.onBackground}}

      >
        <View style={{ margin: 15, gap: 10, marginTop: 10 }}>
          {date && <Text> {date.toString()}</Text>}
          {/* <Text style={styles.buttonText}>Choose Date & Time</Text> */}

          <Button onPress={showDatePicker} mode="contained-tonal" style={{backgroundColor: theme.colors.primary}} labelStyle={{color: theme.colors.background}}>
            Select Date
          </Button>

          <Button onPress={showTimePicker} mode="contained-tonal" style={{backgroundColor: theme.colors.primary}} labelStyle={{color: theme.colors.background}}>
            Select Time
          </Button>
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
          contentContainerStyle={[styles.modalContainer,{backgroundColor: theme.colors.surfaceVariant}, , {borderColor: theme.colors.onBackground}] }
        >
          <ScrollView>
            <Text style={styles.modalHeader}>Choose Your Car Brand</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                flexWrap: "wrap",

                gap: 25,
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
              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Tesla"),
                    setIconBrand(require("../assets/Icons/tesla.png"));
                }}
              >
                <Icon source={require("../assets/Icons/tesla.png")} size={75} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  hideModalBrand(),
                    setCarBrand("Buick"),
                    setIconBrand(require("../assets/Icons/buick.png"));
                }}
              >
                <Icon source={require("../assets/Icons/buick.png")} size={75} />
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
           // backgroundColor: "white",
           backgroundColor: theme.colors.surfaceVariant,
           borderColor: theme.colors.onBackground,
            // margin: 0,
            borderRadius: 15,
            height: "50%",
            borderWidth: 1,
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
                paddingTop: 0,
                gap: 10
              }}
            >
              <Button
                icon={require("../assets/Icons/Sedan.png")}
                labelStyle={{ fontSize: 75 }}
                mode="contained"
                onPress={() => {
                  hideModalBodyStyle(),
                    setBodyStyleCost(35),
                    setBodyStyle("Sedan"),
                    setIconBodyStyle(require("../assets/Icons/Sedan.png"));
                }}
                style={{
                  marginVertical: 15,
                  width: 130,
                  height: 50,
                  justifyContent: "center",
                  backgroundColor: theme.colors.primary
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
                   // color: "white",
                   color: theme.colors.background,
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  $35
                </Text>

              </Button>
              <Button
                icon={require("../assets/Icons/Coupe.png")}
                labelStyle={{ fontSize: 75 }}
                mode="contained"
                onPress={() => {
                  hideModalBodyStyle(),
                    setBodyStyleCost(35),
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
                   // color: "white",
                   color: theme.colors.background,
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  $35
                </Text>
              </Button>
              <Button
                icon={require("../assets/Icons/Hatchback.png")}
                labelStyle={{ fontSize: 75 }}
                mode="contained"
                onPress={() => {
                  hideModalBodyStyle(),
                    setBodyStyleCost(35),
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
                   // color: "white",
                   color: theme.colors.background,
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  $35
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
                   // color: "white",
                   color: theme.colors.background,
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
                    setBodyStyleCost(40),
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
                   // color: "white",
                   color: theme.colors.background,
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  $40
                </Text>
              </Button>
              <Button
                icon={require("../assets/Icons/MiniVan.png")}
                labelStyle={{ fontSize: 75 }}
                mode="contained"
                onPress={() => {
                  hideModalBodyStyle(),
                    setBodyStyleCost(50),
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
                   // color: "white",
                   color: theme.colors.background,
                    alignContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                  }}
                >
                  $50
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
          contentContainerStyle={[styles.modalContainerColorWheel,{backgroundColor: theme.colors.surfaceVariant}, {borderColor: theme.colors.onBackground}] }
        >

            <Text style={{fontSize: 15,
   right: 70,
    marginBottom: 25, // Add margin bottom for spacing
    marginLeft: 25,
    marginTop: 15}}>Choose Your Car Color</Text>
            {/* Updated ColorPicker component */}

            <FlatList
          data={commonColors}
          renderItem={renderColorItem}
          keyExtractor={(item) => item}
          numColumns={4} // Adjust the number of columns based on your design preference
          contentContainerStyle={styles.colorList}
        />

            {/* <Button
              style={{ marginBottom: 25, backgroundColor: theme.colors.primary, bottom: 45 }}
              mode="contained-tonal"
              onPress={() => {
                hideModalColorWheel();
              }}
              labelStyle={{
                fontSize: 20,
                textAlignVertical: "center",
                color: theme.colors.background
                //letterSpacing: 2,
              }}
            >
              Confirm Color
            </Button> */}


        </Modal>
      </Portal>
      <Portal>
        <Dialog visible={visibleDialog} onDismiss={hideDialog}>

        <Dialog.Content>
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
        1. Basic Clean:
      </Text>
      <View style={{ marginLeft: 8 }}>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Vacuuming</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Surface wiping</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Glass and vinyl wipe</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Complete towel dry</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Rim cleaning</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Carpet mats washed</Text>
      </View>

      <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8 }}>
        2. Premium Detailing:
      </Text>
      <View style={{ marginLeft: 8 }}>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Vacuuming</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Carpet shampoo</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Surface wiping and polish</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Glass and vinyl wipe</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Triple coat</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Rust protection</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Tire shine</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Clear coat treatment</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Mirror and glass towel dry</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Deluxe wash</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Vinyl surface treatment</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Rim cleaning</Text>
        <Text style={{ fontSize: 14, marginBottom: 4 }}>• Additional care as needed</Text>
      </View>
    </View>
  </Dialog.Content>






        </Dialog>
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
    //backgroundColor: "white",
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
   // backgroundColor: "white",
  },
  radioContainer: {
   flexDirection: "column",
                  justifyContent: "flex-start",
                  //alignItems: "center",
                  bottom: 13,
                  marginBottom: 8,
                  marginLeft: 10,
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
   // backgroundColor: "white",
    borderWidth: 1,
    height: "80%",
    margin: 25,
    borderRadius: 15
  },
  modalContainerColorWheel: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
   // backgroundColor: "white",
    // margin: 0,
    height: "40%",
borderRadius:15,
    margin: 25,
    borderWidth: 1,
  },
  modalHeader: {
    fontSize: 15,
   // fontWeight: "bold",
    marginBottom: 25, // Add margin bottom for spacing
    marginLeft: 25,
    marginTop: 15
  },
  colorBox: {

    width: width * 0.25, // 40% of the screen width
    height: height * 0.1, // 30% of the screen height
    backgroundColor: 'blue', // Replace with your desired color
    borderRadius: 15,
    position: 'absolute',
    bottom: height * 0.60, // 10% from the bottom
    left: width * 0.45, // 30% from the left
  },
  column: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 10,
  },
  text: {
    fontSize: 13,
    textAlign: 'center',

    marginBottom: 75,
    top: 35,

  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 15,
    borderWidth: 2,
    borderColor: '#ccc',

  },
  colorList: {
    justifyContent: 'center',
    alignItems: 'center',
   // gap: 25
  },
  infoButton: {
    alignSelf: 'center',
    justifyContent: 'center',
    //padding: 8,
   paddingRight: 25
  },
});
export default CarWashOrderScreen;
