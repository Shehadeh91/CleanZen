import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import HomeScreen from "./Screens/HomeScreen";
import SignupScreen from "./Screens/SignUpScreen";
import LogInScreen from "./Screens/LogInScreen";
import OrderScreen from "./Screens/OrdersScreen";
import AccountScreen from "./Screens/AccountScreen";
import CarWashOrderScreen from "./Screens/CarWashOrderScreen ";
 import CheckOutScreen from "./Screens/CheckOutScreen";
import OrderCompleteScreen from "./Screens/OrderCompleteScreen";
import BottomNavagationComponent from "./Components/BottomNavagationComponent";


import LocationSearchScreen from "./Screens/LocationSearchScreen";
import EditAccountScreen from "./Screens/EditAccountScreen";
import TermsOfServiceScreen from "./Screens/TermsOfServiceScreen";
import PrivacyControlScreen from "./Screens/PrivacyControlScreen";
import AdminScreen from "./Screens/AdminScreen";
import UsersScreen from "./Screens/UsersScreen";
import AdminOrdersScreen from "./Screens/AdminOrdersScreen";
// import NotificationSettingsScreen from "./Screens/NotificationSettingsScreen";
// import DarkModeScreen from "./Screens/DarkModeScreen";
import ChangePasswordScreen from "./Screens/ChangePasswordScreen";
import ForgetPasswordScreen from "./Screens/ForgetPasswordScreen";
import { PaperProvider, useTheme } from 'react-native-paper';






const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home"  screenOptions={{ ...TransitionPresets.FadeFromBottomAndroid}}>
          <Stack.Screen
            name="home"
            component={HomeScreen}
            
            options={{ headerShown: false }} // Hide header for Home screen
          />
          <Stack.Screen
            name="account"
            component={AccountScreen}
            options={{
              headerTitle: "Account Settings", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
              headerLeft: null, // Remove the back button
            }}
          />
            <Stack.Screen
            name="admin"
            component={AdminScreen}
            options={{
              headerTitle: "Admin", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
              headerLeft: null, // Remove the back button
            }}
          />
               <Stack.Screen
            name="users"
            component={UsersScreen}
            options={{
              headerTitle: "Users", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
             // headerLeft: null, // Remove the back button
            }}
          />
                  <Stack.Screen
            name="adminOrders"
            component={AdminOrdersScreen}
            options={{
              headerTitle: "All Orders", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
             // headerLeft: null, // Remove the back button
            }}
          />
           <Stack.Screen
            name="edit"
            component={EditAccountScreen}
            options={{
              headerTitle: "Edit Account", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
              headerLeft: null, // Remove the back button
            }}
          />
            <Stack.Screen
            name="changePassword"
            component={ChangePasswordScreen}
            options={{
              headerTitle: "Change Password", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
              //headerLeft: null, // Remove the back button
            }}
          />
             <Stack.Screen
            name="forgetPassword"
            component={ForgetPasswordScreen}
            options={{
              headerTitle: "Recover Password", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
              //headerLeft: null, // Remove the back button
            }}
          />
           {/* <Stack.Screen
            name="notificationSettings"
            component={NotificationSettingsScreen}
            options={{
              headerTitle: "Notification Settings", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
             // headerLeft: null, // Remove the back button
            }}
          /> */}
            {/* <Stack.Screen
            name="darkMode"
            component={DarkModeScreen}
            options={{
              headerTitle: "Dark Mode", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
             // headerLeft: null, // Remove the back button
            }}
          /> */}
             <Stack.Screen
            name="termOfService"
            component={TermsOfServiceScreen}
            options={{
              headerTitle: "Terms of Service", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
             // headerLeft: null, // Remove the back button
            }}
          />
             <Stack.Screen
            name="privacyControl"
            component={PrivacyControlScreen}
            options={{
              headerTitle: "Privacy Control", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
             // headerLeft: null, // Remove the back button
            }}
          />
          <Stack.Screen
            name="signup"
            component={SignupScreen}
            options={{
              headerTitle: "", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
             // headerLeft: null, // Remove the back button
             headerRight: () => null, // Remove the right component (like BottomNavagationComponent)
            }}
          />
           <Stack.Screen
            name="login"
            component={LogInScreen}
            options={{
              headerTitle: "", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
              headerLeft: null, // Remove the back button
              headerRight: null, // Remove the right component (like BottomNavagationComponent)
            }}
          />
          <Stack.Screen
            name="orders"
            component={OrderScreen}
            options={{
              headerTitle: "Order History", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
              headerLeft: null, // Remove the back button
            }}
          />
          <Stack.Screen
            name="carWash"
            component={CarWashOrderScreen}
            options={{
              headerTitle: "Order", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
              headerRight: null
            }}
          />
           <Stack.Screen
            name="map"
            component={LocationSearchScreen}
            options={{
              headerTitle: "Location", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
              headerRight: null
            }}
          />
          <Stack.Screen
            name="checkOut"
            component={CheckOutScreen}
            options={{
              headerTitle: "Check Out", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
            }}
          />
          <Stack.Screen
            name="orderComplete"
            component={OrderCompleteScreen}
            options={{
              headerTitle: "", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: "black", // Set back button color
              headerLeft: null, // Remove the back button
            }}
          />
        </Stack.Navigator>
        {/* BottomNavagationComponent inside NavigationContainer */}
        <BottomNavagationComponent />
      </NavigationContainer>
    
    </PaperProvider>
    
  );
}