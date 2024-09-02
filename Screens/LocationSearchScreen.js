import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import MapView , { Marker }from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Geolocation from 'react-native-geolocation-service';
import useAppStore from "../useAppStore";
import { ThemeProvider, useTheme } from 'react-native-paper';
import { PROVIDER_GOOGLE , PROVIDER_DEFAULT} from 'react-native-maps';
import { updateDoc, doc } from "firebase/firestore";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { FIRESTORE_DB } from "../FirebaseConfig";

const LocationSearch = () => {
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  const [location, setLocation] = useState({
    latitude: 49.8951,
    longitude: -97.1384,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });





  const {name, setName, phone, setPhone, address, setAddress, indexBottom  , setIndexBottom, user, setUser, visible, setVisible, email, setEmail} = useAppStore();
    const theme = useTheme();

  const ref = useRef(null); // Initialize ref with null

  // useEffect(() => {
  //   ref.current?.setAddressText(address);
  // }, [address]);



  const handlePlaceSelect = (data, details) => {


    const point = details.geometry.location;
    if (!point) return;
    setLocation({
      ...location,
      latitude: point.lat,
      longitude: point.lng,
    });
    setAddress(details.formatted_address); // Set the address using setAddress


  };
  const handleAddressSelection = async (details) => {

    const user = auth.currentUser;


    try {


      const userDocRef = doc(FIRESTORE_DB, "Users", user.email );


      await updateDoc(userDocRef, { Address: address });
     // console.log('User address updated successfully');
    } catch (error) {
     // console.error('Error updating user address: ', error);
    }
  };

  return (
    <View style={{ flex: 1, borderWidth: 0.5, backgroundColor: theme.colors.background, paddingTop: 25 }}>
      <GooglePlacesAutocomplete
        ref={ref}

        placeholder="Search"
        fetchDetails={true}
        onPress={(data, details) =>  handlePlaceSelect(data, details)}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
          language: "en",
          components: "country:ca",
        }}
        //currentLocation={true}
        //currentLocationLabel="Current location"
        renderLeftButton={() => (
          <View style={styles.boxIcon}>
            <IonIcons name="search-outline" size={24} />
          </View>
        )}
        styles={{
          container: {
            flex: 0,
padding: 10,

          },
          textInput: {
           // backgroundColor: theme.colors.onBackground,
borderWidth: 1,
            borderColor: theme.colors.onBackground,
            paddingLeft: 35,
            borderRadius: 15,
            color: theme.colors.onBackground
          },
          textInputContainer: {
            backgroundColor: theme.colors.background,
            padding: 8,
            marginVertical: 10,
top:15
          },
        }}
      />
      <MapView
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        showsUserLocation={true}
        style={[styles.map, {backgroundColor: theme.colors.background}]}
        region={location}

        //showsBuildings={true}
        // showsMyLocationButton={true}
        // showsPointsOfInterest={true}
         //showsCompass ={true}
         //showsIndoors = {true}
         //showsScale = {true}
        // showsTraffic = {true}
        // showsIndoorLevelPicker = {true}
         >
        {/* Show Marker at the selected location */}
        <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude,  }} />
      </MapView>
      <View style={[styles.absoluteBox, { backgroundColor: theme.colors.primary}]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.goBack();
            handleAddressSelection();
           // console.log( address);
          }}
        >
          <Text style={{ backgroundColor: theme.colors.primary,
   // padding: 16,
    margin: 10,
   //fontSize: 25,
    textAlign: 'center',
    alignItems: "center",
   // borderRadius: 15,
   fontSize: 20,
               // textAlignVertical: "center",
                color: theme.colors.background
               // letterSpacing: 5,
    }}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationSearch;

const styles = StyleSheet.create({
  map: {
    flex: 1,
    margin: 5,
    marginTop: 0,
    marginBottom: 10

  },
  absoluteBox: {
    //position: "absolute",
    //bottom: -20,
   // height: 100,
    //width: "100%",
  // marginTop: 600, // This marginTop may need adjustment based on your layout
   // padding:-50
   alignContent: 'center',
   alignSelf: 'center',
borderRadius:25,
width:'75%',
height: 'auto',
marginBottom: 25
  },

  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  boxIcon: {
    position: 'absolute',
    left: 15,
    top: 18,
    zIndex: 1,
  },
});
