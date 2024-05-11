import React, { useEffect } from 'react';
import { View, Text, BackHandler } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; // Added import
import { useBottomNavigationVisible, usePageIndex } from "../useAppStore";

const OrderCompleteScreen = () => {
  const navigation = useNavigation();

  const [visible  , setVisible ] = useBottomNavigationVisible(state => [state.visible, state.setVisible]);
  const [index  , setIndex ] = usePageIndex(state => [state.index, state.setIndex]);
 

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
    setIndex(0);
  };

  const goToOrders = () => {
    navigation.navigate('orders');
    setVisible(true);
    setIndex(2);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Your Order Is Complete
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
