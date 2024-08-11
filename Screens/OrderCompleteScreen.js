import React, { useEffect } from 'react';
import { View, Text, BackHandler, Image, StyleSheet, Dimensions } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; // Added import
import useAppStore from '../useAppStore';


const { width, height } = Dimensions.get('window');

const OrderCompleteScreen = () => {
  const navigation = useNavigation();

  const {name, setName, phone, setPhone, address, setAddress, indexBottom  , setIndexBottom, user, setUser, visible, setVisible, email, setEmail} = useAppStore();
const theme = useTheme();

  useEffect(() => {
    const backAction = () => {
      // Prevent going back when on OrderCompleteScreen
      return true; // Returning true prevents the default behavior (going back)
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // Clean up the event listener

  }, []);

  const goToHome = () => {
    navigation.navigate('home');
    setVisible(true);
    setIndexBottom(0);
  };

  const goToOrders = () => {
    navigation.navigate('orders');
    setVisible(true);
    setIndexBottom(2);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
    <Image  style={{tintColor: theme.colors.onBackground, height: 300, width: 300,  bottom: 100, marginBottom: -150}} resizeMode= 'cover' source={require("./PureCare.png")} />
    <Text style={[styles.text, { color: theme.colors.onBackground }]}>
  Thank you for choosing PureCare Tech!{'\n'}
  Your order has been successfully placed and is now being processed.{'\n'}
  We’ll keep you informed with updates.
</Text>
      <Button mode="contained" onPress={goToHome} style={{ marginBottom: 10 }}>
        Home
      </Button>
      <Button mode="contained" onPress={goToOrders}>
        Orders
      </Button>
    </View>
  );
};


const styles = StyleSheet.create({

  text: {
    fontSize: 18,        // Adjusted font size for readability
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,   // Space between the text and buttons
    paddingHorizontal: 20, // Padding for better text readability on small screens
    lineHeight: 28, // Adjust this value to add space between lines
  },
});
export default OrderCompleteScreen;
