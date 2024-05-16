import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Geolocation from 'react-native-geolocation-service';
import useAppStore from "../useAppStore";
import { ThemeProvider, useTheme } from 'react-native-paper';
import { PROVIDER_GOOGLE } from 'react-native-maps';


const LocationSearch = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState({
    latitude: 53.76086,
    longitude: -98.813873,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

 

  const {name, setName, phone, setPhone, address, setAddress, indexBottom  , setIndexBottom, user, setUser, visible, setVisible, email, setEmail} = useAppStore();
    const theme = useTheme();

  const ref = useRef(null); // Initialize ref with null

  useEffect(() => {
    ref.current?.setAddressText(address);
  }, [address]);

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


  return (
    <View style={{ flex: 1, marginTop: 75, borderWidth: 0.5 }}>
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
          },
          textInput: {
            backgroundColor: theme.colors.outlineVariant,
            paddingLeft: 35,
            borderRadius: 15,
          },
          textInputContainer: {
            backgroundColor: "white",
            padding: 8,
          },
        }}
      />
      <MapView
      provider= {PROVIDER_GOOGLE}
        showsUserLocation={true}
        style={styles.map}
        region={location}
        showsBuildings={true}
        // showsMyLocationButton={true}
      />
      <View style={styles.absoluteBox}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.goBack();
           // console.log( address);
          }}
        >
          <Text style={{ backgroundColor: theme.colors.primary,
    padding: 16,
    margin: 16,
    fontSize: 25,
    textAlign: 'center',
    alignItems: "center",
    borderRadius: 15,
    fontSize: 20,
                textAlignVertical: "center",
                letterSpacing: 5,
    color: 'white'}}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationSearch;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  absoluteBox: {
    position: "absolute",
    //bottom: -20,
    height: 100,
    width: "100%",
    marginTop: 600, // This marginTop may need adjustment based on your layout
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
