import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
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
  Divider,
  useTheme,

} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc, setDoc } from "@react-native-firebase/firestore";
import BottomSheet from '@gorhom/bottom-sheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dryCleanData from "../assets/dryCleanData.json";
import useDryCleanCart from "../useDryCleanStore";
import useAppStore from "../useAppStore";

const DryCleanOrderScreen = () => {
  const navigation = useNavigation();
  const [text, setText] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Added state for search query

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
    setServiceTime,
    date,
    setDate
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
  const theme = useTheme();
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

 useEffect(() => {
  setDeliveryOption();
}, []);

  const handleConfirm = (dateTime) => {
  const now = new Date();

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
useEffect(() => {
  setDate();
  setVisible(false);
}, []);

useEffect(() => {
  const user = auth.currentUser;
  const fetchUserData = async () => {

    if (user && user.email) {
      try {
        const docRef = doc(FIRESTORE_DB, 'Users', user.email); // Get the document reference
        const docSnap = await getDoc(docRef); // Fetch the document

        if (docSnap.exists()) {
          const data = docSnap.data();
          //setUserData(data); // Set user data
         setAddress(data.Address); // Set address state


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


  const addDryCleanOrder = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !user.emailVerified) {
        //console.error("Error: User is not authenticated.");
        navigation.navigate("login");

        return;
      }

      const userId = user?.email || "UnknownUser";
      if (!userId) {
       // console.error("Error: User email is null or undefined.");
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
        Total: ((getTotalPrice() + deliveryCost + 4 +((getTotalPrice()+ deliveryCost + 4) * 0.05)).toFixed(2)),
        Status: "InProgress",
        Assigned: "No One",
        Service: "Dry Clean",
        EstimateTime: serviceTime,
        Date: date
      });

      await setDoc(
        counterDocRef,
        { orderNumber: orderNumber },
        { merge: true }
      );
      // console.log(
      //   "Added dry clean order document ID:",
      //   `${userId}_${orderNumber}`
      // );
      navigation.navigate("orderComplete");
    } catch (error) {
      //.error("Error adding car wash order:", error);
    }
  };




  const Item = React.memo(({ item, lastItem }) => {
    const { addToCart, removeFromCart, itemCounts, getTotalPrice } =
      useDryCleanCart();

    return (
      <>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <View style={{ flex: 1, bottom: -7 }}>
            <Text>{item?.title}</Text>
            <Text style={{ color: "green" }}>${item?.price}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              removeFromCart(item.id);
            }}
          >
            <Icon source="minus-thick" size={25} />
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 15, fontSize: 15 }}>{itemCounts[item.id]}</Text>
          <TouchableOpacity
            onPress={() => {
              addToCart(item?.id);
            }}
          >
            <Icon source="plus-thick" size={25} />
          </TouchableOpacity>
        </View>
        {!lastItem && <Divider />}
      </>
    );
  });

   // Filter items based on the search query
   const filteredItems = dryCleanData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header style={{  height: 50, top: 10}}>
      <Appbar.Content
          title={"Subtotal: $" + (getTotalPrice() + deliveryCost).toFixed(2)}
          style={{ position: "absolute", alignItems: 'flex-end', right: 30 }}
          titleStyle={{ fontSize: 15, textAlign: 'center' }}
        />
      </Appbar.Header>
      <ScrollView style={styles.scrollView}>
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Car Location Card */}
      <TouchableOpacity onPress={() => navigation.navigate("map")}>
      <Card style={[styles.card, {borderColor: theme.colors.onBackground}]}>
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
                  color: theme.colors.onBackground,
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
            <TextInput
                placeholder="Search items..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                  height: 40,
                  borderColor: "gray",
                  borderWidth: 1,
                  marginBottom: 20,
                  paddingHorizontal: 10,
                }}
              />
<ScrollView style={{height:300}} nestedScrollEnabled = {true}>
              {filteredItems.map((item, index) => (
                <Item
                  key={item.id}
                  item={item}
                  lastItem={index === filteredItems.length - 1}
                />
              ))}
              </ScrollView>
            </Card.Content>
          </Card>
          {/* Preference Card */}
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
                  {bottomSheetRef.current?.close()}
                } else if (newValue === "Priority") {
                  setDeliveryCost(3.99);
                  setServiceTime(45);
                  setDate("Urgent");
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
                {/* <RadioButton.Item label="Standard" value="Standard"  />
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
                </Text> */}
                <RadioButton.Item
                    label="Schedule"
                    value="Schedule"

                  />
                     <Text
                  style={{
                    fontSize: 13,
                    left: 17,
                    top: 40,
                   // color: "grey",
                    position: "absolute",
                  }}
                >
                  {date && date.toString() }
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
 else {
                // Add code to handle the case when there's no input in the TextInput
                navigation.navigate("dryCleanCheckOut", {
                  addDryCleanOrder: addDryCleanOrder,
                });


              }
            }}

              // updateTotalCost(2);

            labelStyle={{
              fontSize: 20,
              textAlignVertical: "center",

             // letterSpacing: 10,
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
        backgroundStyle={{ borderWidth: 2, borderRadius: 25, backgroundColor: theme.colors.surfaceVariant,  borderColor: theme.colors.onBackground}}

             >
        <View style={{margin: 15, gap: 10, marginTop: 10}} >
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
   // backgroundColor: "white",
    paddingTop: 15,
    flex: 1,
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
    //backgroundColor: "white",
    borderWidth: 3,
    height: "80%",
    margin: 25,
  },
  modalContainerColorWheel: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
   // backgroundColor: "white",
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
