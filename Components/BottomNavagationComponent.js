import React, { useEffect, useState } from "react";
import { BottomNavigation } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useNavigation and useFocusEffect hooks
import { useBottomNavigationVisible, usePageIndex } from "../useAppStore";


const HomeRoute = () => null;
const AccountRoute = () => null;
const OrdersRoute = () => null;

const BottomNavagationComponent = ({ onIndexChange }) => {
  const navigation = useNavigation();

  const [index, setIndex] = usePageIndex(state => [state.index, state.setIndex]);

  const [visible  , setVisible ] = useBottomNavigationVisible(state => [state.visible, state.setVisible]);

  const [routes] = React.useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'account', title: 'Account', focusedIcon: 'account', unfocusedIcon: 'account-outline'},
    { key: 'orders', title: 'Orders', focusedIcon: 'receipt'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    account: AccountRoute,
    orders: OrdersRoute,
  });

  // Use useFocusEffect to detect when the HomeScreen is focused
  useFocusEffect(
    React.useCallback(() => {
      // Set the index to 0 (Home) when the HomeScreen is focused
      setIndex(0);
    }, [])
  );

  

  React.useEffect(() => {
    if (typeof onIndexChange === 'function') {
      onIndexChange(index); // Call onIndexChange with the current index value
    }
  }, [index, onIndexChange]);

  const handleNavigation = (newIndex) => {
    setIndex(newIndex);
    const routeKey = routes[newIndex].key;
    navigation.navigate(routeKey); // Navigate to the selected route
  };
  if (!visible) { // Conditionally render based on 'visible' prop
    return null;
  }
  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={handleNavigation}
      renderScene={renderScene}
      activeColor='purple'
      barStyle={{ backgroundColor: 'white' }}
      safeAreaInsets={{ bottom: 20 }}
      compact={true}
      style={{ flex: 0.1, marginBottom: 0, borderWidth: 1, borderColor: 'black' }}
    />
  );
};

export default BottomNavagationComponent;
