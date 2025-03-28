import * as React from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  TouchableOpacity
} from "react-native";
import { ActivityIndicator, Button, useTheme, IconButton  } from "react-native-paper";
import { useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { signInWithEmailAndPassword, getAuth} from "firebase/auth"; // Corrected import
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import useAppStore from "../useAppStore";


const LogInScreen = () => {
  const {name, setName, phone, setPhone, address, setAddress, indexBottom  , setIndexBottom, user, setUser, visible, setVisible, email, setEmail} = useAppStore();
   const [password, setPassword] = useState("");
   const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation(); // Added navigation
const theme = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      setVisible(true); // Ensure bottom navigation is visible when HomeScreen is focused
      //setIndex(1);
      return () => {
        // Clean-up function when screen loses focus (optional)
      };
    }, [])
  );


  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;
      if (user && user.emailVerified) {
        // Check if the user's role is "Client"
        const userDocRef = doc(FIRESTORE_DB, "Users", user.email);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setName(userData.Name),
          setPhone(userData.Phone),
          setUser(user)
          if (userData && userData.Role === "Client") {
            navigation.navigate('home');
            setIndexBottom(0);
            setVisible(true)
          }
          else  if (userData && userData.Role === "Admin") {
            navigation.navigate('admin');
            setVisible(false)
          }
          else  if (userData && userData.Role === "Agent") {
            navigation.navigate('agent');
            setVisible(false)
          }


          else {
            Alert.alert(
              "Access Denied",
              "You do not have permission to access this account.",
              [
                {
                  text: "OK",
                 // onPress: () => console.log("OK Pressed"),
                },
              ]
            );
          }
        }
      } else {
        Alert.alert(
          "Email Verification Required",
          "Please verify your email before logging in.",
          [
            {
              text: "OK",
             // onPress: () => console.log("OK Pressed"),
            },
          ]
        );
      }
    } catch (error) {
      //console.log(error);
      alert("Sign-In Failed: Check your email and password or verify your email address.");
    } finally {
      setLoading(false);
      //navigation.navigate('account');
       // setIndex(1);
    }
  };


  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -500}
    >
      <Text style={[styles.title, {color: theme.colors.onBackground}]} >Log In</Text>
      <TextInput
        style={[styles.input, {color: theme.colors.onBackground}, {borderColor: theme.colors.onBackground}]}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholderTextColor={theme.colors.onBackground}

      />
       <View style={styles.passwordContainer}>
      <TextInput
        style={[styles.input, {color: theme.colors.onBackground}, {borderColor: theme.colors.onBackground}]}
        placeholder="Password"
        secureTextEntry={!passwordVisible}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        placeholderTextColor={theme.colors.onBackground}
      />
       <TouchableOpacity
         style={styles.icon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
         <IconButton
            icon={passwordVisible ? "eye" : "eye-off"}
            color={theme.colors.onBackground}
            size={20}
          />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <>
          <Button style={[styles.button, {backgroundColor: theme.colors.primary}]} mode="contained" onPress={signIn}>
            Log In
          </Button>
          <Button style={styles.button} mode="text" onPress={() => {navigation.navigate('forgetPassword')}}>
            Forget Password
          </Button>
          <Button style={styles.button} mode="text" onPress={() => {navigation.navigate('signup')}}>
            Need An Account? Sign Up
          </Button>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default LogInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
   // backgroundColor: "#fff",
    height: "100%",
    paddingTop: 50
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
   // color: "black",
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    //borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    width: "80%",
    paddingVertical: -25,
  },
  passwordContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
  },
});
