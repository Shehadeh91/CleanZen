import React, { useEffect, useState } from "react";
import { BottomNavigation, useTheme } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useNavigation and useFocusEffect hooks
import useAppStore from "../useAppStore";


const HomeRoute = () => null;
const AccountRoute = () => null;
const OrdersRoute = () => null;

const BottomNavagationComponent = ({ onIndexChange }) => {
  const navigation = useNavigation();
  const theme = useTheme();

  const {name, setName, phone, setPhone, address, setAddress, indexBottom  , setIndexBottom, user, setUser, visible, setVisible, email, setEmail} = useAppStore();


  const [routes] = React.useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'account', title: 'Account', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
    { key: 'orders', title: 'Orders', focusedIcon: 'receipt' },
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
      setIndexBottom(0);
    }, [])
  );



  React.useEffect(() => {
    if (typeof onIndexChange === 'function') {
      onIndexChange(indexBottom); // Call onIndexChange with the current index value
    }
  }, [indexBottom, onIndexChange]);

  const handleNavigation = (newIndex) => {
    setIndexBottom(newIndex);
    const routeKey = routes[newIndex].key;
    navigation.navigate(routeKey); // Navigate to the selected route
  };
  if (!visible) { // Conditionally render based on 'visible' prop
    return null;
  }
  return (
    <BottomNavigation
      navigationState={{ index: indexBottom, routes }}
      onIndexChange={handleNavigation}
      renderScene={renderScene}
      activeColor='#6953A4'
      inactiveColor= {{ backgroundColor: theme.colors.onBackground }}

      barStyle={{ backgroundColor: theme.colors.background }}
      safeAreaInsets={{ bottom: 20 }}
      compact={true}
      style={[{ flex: 0.1, marginBottom: 0, borderWidth: 0.1 },{borderColor: theme.colors.onBackground}] }
    />
  );
};

export default BottomNavagationComponent;
