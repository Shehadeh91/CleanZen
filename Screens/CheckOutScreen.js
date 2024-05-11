import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import firebase from "firebase/compat/app";
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
} from "react-native-paper";
import {
  useCarPlateStore,
  useNoteStore,
  useBodyStyleStore,
  useIconBodyStyleStore,
  useCarBrandStore,
  useIconCarBrandStore,
  useCarColorStore,
  usePaymentOptionStore,
  useDeliveryOptionStore,
  usePrefrenceOptionStore,
  useDeliveryCostStore,
  usePrefrenceCostStore,
  useBodyStyleCostStore,
  useTotalCostStore,
  useDateStore,
} from "../useCarWashStore";
import { useAddress } from "../useAppStore";

const CheckOutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { addCarWashOrder } = route.params; // Assuming route.params is available

  const [note, setNote] = useNoteStore((state) => [state.note, state.setNote]);
  const [iconBrand, setIconBrand] = useIconCarBrandStore((state) => [
    state.iconBrand,
    state.setIconBrand,
  ]);
  const [carPlate, setCarPlate] = useCarPlateStore((state) => [
    state.carPlate,
    state.setCarPlate,
  ]);

  const [date, setDate, getFormattedDate] = useDateStore((state) => [
    state.date,
    state.setDate,
    state.getFormattedDate,
  ]);

  const [iconBodyStyle, setIconBodyStyle] = useIconBodyStyleStore((state) => [
    state.iconBodyStyle,
    state.setIconBodyStyle,
  ]);
  const [currentColor, setCurrentColor] = useCarColorStore((state) => [
    state.currentColor,
    state.setCurrentColor,
  ]);
  const [paymentOption, setPaymentOption] = usePaymentOptionStore((state) => [
    state.paymentOption,
    state.setPaymentOption,
  ]);
  const [deliveryOption, setDeliveryOption] = useDeliveryOptionStore(
    (state) => [state.deliveryOption, state.setDeliveryOption]
  );
  const [prefrenceOption, setPrefrenceOption] = usePrefrenceOptionStore(
    (state) => [state.prefrenceOption, state.setPrefrenceOption]
  );
  const [deliveryCost, setDeliveryCost] = useDeliveryCostStore((state) => [
    state.deliveryCost,
    state.setDeliveryCost,
  ]);
  const [prefrenceCost, setPrefrenceCost] = usePrefrenceCostStore((state) => [
    state.prefrenceCost,
    state.setPrefrenceCost,
  ]);
  const [bodyStyleCost, setBodyStyleCost] = useBodyStyleCostStore((state) => [
    state.bodyStyleCost,
    state.setBodyStyleCost,
  ]);

  const [totalCost, updateTotalCost] = useTotalCostStore((state) => [
    state.totalCost,
    state.updateTotalCost,
  ]);
  const [address, setAddress] = useAddress((state) => [
    state.address,
    state.setAddress,
  ]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    updateTotalCost(bodyStyleCost + prefrenceCost + deliveryCost + 100);
  }, []); // Empty dependency array to run the effect once on mount

  const handleConfirmOrder = async () => {
    setIsLoading(true); // Show activity indicator
    try {
      const isConnected = await NetInfo.fetch().then(
        (state) => state.isConnected
      );
      if (!isConnected) {
        // No internet connection
        Alert.alert("No Internet", "Please check your internet connection.");
        return;
      }

      if (addCarWashOrder) {
        // Check if the function exists
        await addCarWashOrder(); // Call the function
        // Other logic after adding the car wash order
        console.log("Car wash order added successfully!");
        //
      }
    } catch (error) {
      // console.error("Error adding car wash order:", error);
    } finally {
      setIsLoading(false); // Hide activity indicator
    }
  };

  return (
    
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ height: 50, top: 5 }}>
          <Appbar.Content
            title={
              "Total: $" +
              (bodyStyleCost + prefrenceCost + deliveryCost).toFixed(2)
            }
            style={{
              position: "absolute",
              left: 215,
              //backgroundColor: "lightgrey",
            }}
          />
        </Appbar.Header>
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            {/* Car Location Card */}

            <Card style={styles.card}>
              <Card.Title
                title={address}
                titleStyle={{
                  fontSize: 20,
                  flexWrap: "wrap",
                  // textAlign: "center",
                  maxWidth: "100%",
                  height: 60,
                  padding: 10,
                  left: -10,
                  textAlignVertical: "center",
                }}
                left={(props) => (
                  <Avatar.Icon
                    {...props}
                    icon="map-marker"
                    size={55}
                    left={-10}
                  />
                )}
                multiline={2}
              />
            </Card>
            <Card style={styles.card}>
              <Card.Title
                title={deliveryOption}
                titleStyle={{ fontSize: 20, marginTop: 10 }}
                subtitle={date}
                left={(props) => (
                  <Avatar.Icon
                    {...props}
                    icon="calendar-clock-outline"
                    size={55}
                    left={-10}
                  />
                )}
              />
              {/* <Text
                style={{ fontSize: 20, left: 200, bottom: 50, color: "green", borderWidth: 1, borderColor: 'red', width: 100, height: 100, marginBottom: -25 }}
              >
                {deliveryCost}
               
              </Text> */}
            </Card>

            <Card style={styles.card}>
              <Card.Title
                title={prefrenceOption + " " + "Car Wash"}
                titleStyle={{ fontSize: 20 }}
                left={(props) => (
                  <Avatar.Icon
                    {...props}
                    icon="numeric-1-circle"
                    size={55}
                    left={-10}
                  />
                )}
              />
              {/* <Text
                 style={{ fontSize: 20, left: 250, bottom: 50, color: "green", borderWidth: 1, borderColor: 'red', width: 100, height: 100, marginBottom: -25 }}
              >
                $+ {prefrenceCost + bodyStyleCost} 
              </Text> */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginTop: -30,
                  marginHorizontal: 50,
                  borderColor: "red",
                }}
              >
                <Button
                  style={{
                    width: 90,
                    height: 40,
                    //borderRadius: 15,
                    //justifyContent: "center",
                    // alignItems: "center",
                    //backgroundColor: "#007bff",
                    top: 5,
                    marginLeft: 30,
                  }}
                  icon={iconBrand}
                  mode="text"
                  labelStyle={{ fontSize: 50 }}
                  //contentStyle={{ left: 0 }}
                >
                  {/* Brand */}
                </Button>
                <Button
                  style={{
                    width: 90,
                    height: 40,
                    borderRadius: 15,
                    //justifyContent: "center",
                    // alignItems: "center",
                    //backgroundColor: "#007bff",

                    marginLeft: 30,
                  }}
                  //icon="camera"
                  labelStyle={{ fontSize: 60 }}
                  contentStyle={{ left: 7 }}
                  icon={iconBodyStyle}
                  mode="text"
                >
                  {/* Style */}
                </Button>
                <Button
                  style={styles.rectangularButton}
                  icon="circle"
                  labelStyle={{ fontSize: 40, color: currentColor }}
                  mode="text"
                  contentStyle={{ left: 7 }}
                ></Button>
                <Button
                  style={{
                    width: 125,
                    //  height: 40,
                    left: 25,
                    borderWidth: 2,
                    marginVertical: 10,
                    //marginLeft: 30,
                  }}
                  //contentStyle={{borderWidth: 1, width: 130,}}
                  labelStyle={{ fontSize: 20, textAlign: "center" }}
                  mode="text"
                >
                  {" "}
                  <Text>{carPlate}</Text>
                </Button>
              </View>
            </Card>

            <Card style={styles.card}>
              <Card.Title
                // title="Note"
                titleStyle={{ fontSize: 20, marginTop: 10 }}
                // subtitle= "example"

                left={(props) => (
                  <Avatar.Icon {...props} icon="note" size={55} left={-10} />
                )}
              />
              <Card.Content
                style={{ marginHorizontal: 50, marginTop: -60, width: 275 }}
              >
                <TextInput
                  //label="Address"
                  value={note}
                  mode="outlined"
                  borderColor="red"
                  // borderWidth = {2}
                  onChangeText={(text) => setNote(text)}
                  // width={200}
                />
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Title
                title="Payment"
                titleStyle={{ fontSize: 20, marginTop: 10 }}
                left={(props) => (
                  <Avatar.Icon {...props} icon="cash" size={55} left={-10} />
                )}
              />
              <RadioButton.Group
                onValueChange={(newValue) => {
                  setPaymentOption(newValue);
                  //   updateTotalCost(bodyStyleCost + prefrenceCost + deliveryCost + 100)
                }}
                value={paymentOption}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginTop: -30,
                    marginHorizontal: 50,
                    borderColor: "red",
                  }}
                >
                  <RadioButton.Item label="Cash" value="Cash" />
                  <RadioButton.Item label="Card" value="Card" disabled />
                </View>
              </RadioButton.Group>
            </Card>
            {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
            <Button
              style={{ marginBottom: 28, bottom: -10 }}
              mode="contained"
              onPress={() => handleConfirmOrder()}
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
      </View>
   
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: 'column',
      flex: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "white",
    paddingTop: 15,
    
   
  },
  card: {
    marginBottom: 16,
    borderWidth: 3,
    backgroundColor: "white",
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
    // margin: 0,
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
    borderWidth: 1,
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

export default CheckOutScreen;
