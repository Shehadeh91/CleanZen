import React, { useEffect, useState, useContext } from "react";
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
import DryCleanOrderScreen from "./Screens/DryCleanOrderScreen";
import BottomNavagationComponent from "./Components/BottomNavagationComponent";

//import { SafeAreaView } from "react-native";
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { lightTheme, darkTheme } from "./Components/Themes";

import LocationSearchScreen from "./Screens/LocationSearchScreen";
import EditAccountScreen from "./Screens/EditAccountScreen";
import TermsOfServiceScreen from "./Screens/TermsOfServiceScreen";
import PrivacyControlScreen from "./Screens/PrivacyControlScreen";
import AdminScreen from "./Screens/AdminScreen";
import UsersScreen from "./Screens/UsersScreen";
import AdminOrdersScreen from "./Screens/AdminOrdersScreen";
import AgentOrdersScreen from "./Screens/AgentOrdersScreen";
import AgentScreen from "./Screens/AgentScreen";
import DryCleanCheckOutScreen from "./Screens/DryCleanCheckOutScreen";
import RoomCleanOrderScreen from "./Screens/RoomCleanOrderScreen";
import RoomCleanCheckOutScreen from "./Screens/RoomCleanCheckOutScreen";
import AgentEarningOverviewScreen from "./Screens/AgentEarningOverviewScreen";
// import NotificationSettingsScreen from "./Screens/NotificationSettingsScreen";
// import DarkModeScreen from "./Screens/DarkModeScreen";
import ChangePasswordScreen from "./Screens/ChangePasswordScreen";
import ForgetPasswordScreen from "./Screens/ForgetPasswordScreen";
import { Button, PaperProvider, useTheme } from 'react-native-paper';
import { StripeProvider } from "@stripe/stripe-react-native";
import { useColorScheme, StatusBar, View, StyleSheet, Platform, ActivityIndicator} from "react-native";

import { FIREBASE_AUTH, FIRESTORE_DB } from "./FirebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import useAppStore from "./useAppStore";
import { onAuthStateChanged } from "firebase/auth";

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState("home");
  const { setVisible } = useAppStore();
  const [isLoading, setLoading] = useState(true);
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.emailVerified) {
        try {
          const userDocRef = doc(FIRESTORE_DB, "Users", user.email);
          const docSnapshot = await getDoc(userDocRef);

          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            if (userData.Role === "Agent") {
              setInitialRoute("agent");
              setVisible(false);
             // console.log("AGENT");
            }  else if (userData.Role === "Admin") {
              setInitialRoute("admin");
              setVisible(false);
             // console.log("ADMIN");
            }
             else {
              setInitialRoute("home"); // Or another route based on the role
             // console.log("HOME");
            }
          } else {
            setInitialRoute("home");
           // console.log("ELSE");
          }
        } catch (error) {
         // console.error("Error fetching user role:", error);
          setInitialRoute("home");
         // console.log("CATCH");
        }
      } else {
        setInitialRoute("home");
       // console.log("ELSE ELSE");
      }
      setLoading(false); // End loading after processing user role
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, [auth, setVisible]);

  const colorScheme = useColorScheme();
   // Select the theme based on the color scheme
   const theme = colorScheme === 'light' ? lightTheme : darkTheme;
  // console.log('Applying theme:', colorScheme);


  if (isLoading) {
    return (
      <View style={{ margin: 250, alignSelf: 'center'}}>
        <ActivityIndicator size={75} color={theme.colors.primary} />
      </View>
    );
  }
  return (
<SafeAreaView  style={styles.container}>
    <PaperProvider theme={theme}>
    <StripeProvider publishableKey="pk_live_51PIuTYRwhciiEfEmcWuiDdwy9ZvSGPAGX9MjMLYM4VLTpJcqBkoYX3dxZUGoSUOAgrjKOSzESViCOABqLD831TXH00m6iVILkh"
    urlScheme="your-url-scheme" >

          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent={true}
          />
          <NavigationContainer>
        <Stack.Navigator  initialRouteName={initialRoute}  screenOptions={{ ...TransitionPresets.FadeFromBottomAndroid}}>
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
              headerTintColor: theme.colors.onBackground, // Set back button color
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
              headerTintColor: theme.colors.onBackground, // Set back button color
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
              headerTintColor: theme.colors.onBackground, // Set back button color
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
              headerTintColor: theme.colors.onBackground, // Set back button color
             // headerLeft: null, // Remove the back button
            }}
          />
              <Stack.Screen
            name="agent"

            component={AgentScreen}
            options={{
              headerTitle: "Agent", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: theme.colors.onBackground, // Set back button color
              headerLeft: null, // Remove the back button

            }}
          />
            <Stack.Screen
            name="agentOrders"
            component={AgentOrdersScreen}
            options={{
              headerTitle: "Orders", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: theme.colors.onBackground, // Set back button color
             // headerLeft: null, // Remove the back button
            }}
          />
            <Stack.Screen
            name="earningOverview"
            component={AgentEarningOverviewScreen}
            options={{
              headerTitle: "Earning Overview", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: theme.colors.onBackground, // Set back button color
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
              headerTintColor: theme.colors.onBackground, // Set back button color
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
              headerTintColor: theme.colors.onBackground, // Set back button color
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
              headerTintColor: theme.colors.onBackground, // Set back button color
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
              headerTintColor: theme.colors.onBackground, // Set back button color
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
              headerTintColor: theme.colors.onBackground, // Set back button color
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
              headerTintColor: theme.colors.onBackground, // Set back button color
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
              headerTintColor: theme.colors.onBackground, // Set back button color
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
              headerTintColor: theme.colors.onBackground, // Set back button color
              headerLeft: null, // Remove the back button
            }}
          />
          <Stack.Screen
            name="carWash"
            component={CarWashOrderScreen}
            options={{
              headerTitle: "Car Wash", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: theme.colors.onBackground, // Set back button color
              headerRight: null
            }}
          />
           <Stack.Screen
            name="dryClean"
            component={DryCleanOrderScreen}
            options={{
              headerTitle: "Dry Clean", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: theme.colors.onBackground, // Set back button color
              headerRight: null
            }}
          />
            <Stack.Screen
            name="roomClean"
            component={RoomCleanOrderScreen}
            options={{
              headerTitle: "Room Clean", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: theme.colors.onBackground, // Set back button color
              headerRight: null
            }}
          />
            <Stack.Screen
            name="dryCleanCheckOut"
            component={DryCleanCheckOutScreen}
            options={{
              headerTitle: "Check Out", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: theme.colors.onBackground, // Set back button color
              headerRight: null
            }}
          />
           <Stack.Screen
            name="roomCleanCheckOut"
            component={RoomCleanCheckOutScreen}
            options={{
              headerTitle: "Check Out", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: theme.colors.onBackground, // Set back button color
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
              headerTintColor: theme.colors.onBackground, // Set back button color
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
              headerTintColor: theme.colors.onBackground, // Set back button color
            }}
          />
          <Stack.Screen
            name="orderComplete"
            component={OrderCompleteScreen}
            options={{
              headerTitle: "", // Hide header title
              headerBackTitleVisible: false, // Hide back button title
              headerTransparent: true, // Make header transparent
              headerTintColor: theme.colors.onBackground, // Set back button color
              headerLeft: null, // Remove the back button
            }}
          />
        </Stack.Navigator>
        {/* BottomNavagationComponent inside NavigationContainer */}
        <BottomNavagationComponent />
      </NavigationContainer>

      </StripeProvider>
    </PaperProvider>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
   // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});