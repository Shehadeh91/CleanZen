import React, { useEffect } from 'react';
import { View, Text, BackHandler, Image } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; // Added import
import useAppStore from '../useAppStore';

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
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: theme.colors.onBackground }}>
        We are on the way!
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

export default OrderCompleteScreen;
