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
import { useEffect, useState } from "react"; // Import useEffect
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { collection, addDoc } from "firebase/firestore";
import { ActivityIndicator, Button, useTheme, IconButton } from "react-native-paper";

import { FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import useAppStore from "../useAppStore";

const SignupScreen = ({ navigation }) => {
  //const [fullName, setFullName] = React.useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const auth = FIREBASE_AUTH;
const theme = useTheme();
  const {name, setName, phone, setPhone, address, setAddress, indexBottom  , setIndexBottom, user, setUser, visible, setVisible, email, setEmail,setCarPlate,carPlate,setCarBrand,carBrand,setBodyStyle,bodyStyle,setIconBodyStyle,iconBodyStyle,setCurrentColor,currentColor} = useAppStore();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      // setVisible(true); // Ensure bottom navigation is visible when HomeScreen is focused
      setIndexBottom(1);
      return () => {
        // Clean-up function when screen loses focus (optional)
      };
    }, [])
  );

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        if (currentUser.emailVerified) { // Check if email is verified
          navigation.navigate("login");
        } else {
          alert("Please verify your email to sign in.");
        }
      } else {
        setUser(null);
        setName(null);
        setPhone(null);
        setEmail(null);
        setPassword(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleSignup = async () => {
    //Check if the password meets complexity requirements
    if (
      !/(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{7,}/.test(password)
    ) {
      alert(
        "Password must be at least 7 characters long and include at least one number, one uppercase letter, and one special character (!@#$%^&*). Example: Passw0rd!"
      );
      return; // Exit the function if password is invalid
    }

    // Check if the phone number is valid (10 digits)
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return; // Exit the function if phone number is invalid
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Create the user with email and password
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password

      );
// Send verification email
await sendEmailVerification(auth.currentUser);
      const usersCollectionRef = collection(FIRESTORE_DB, "Users");

      const userDocRef = doc(usersCollectionRef, user.email);
      // Add a new document to the "Users" collection with auto-generated ID
      // Set document data using setDoc
      await setDoc(userDocRef, {
        userId: user.uid, // Assuming you want to save the user's UID
        Name: name,
        Email: email,
        Address: address,
        CarBrand: carBrand,
        CarBody: bodyStyle,
       // BodyTypeIcon: iconBodyStyle,
        CarColor: currentColor,
        PlateNumber: carPlate,
        Phone: phone,
        Password: password,
        Role: "Client"
      });

      // Update Zustand states with user's name and phone
      setName(name);
      setPhone(phone);

     // console.log("User created:", user);
      alert("Check your emails!");
    } catch (error) {
     // console.log(error);
      alert("Sign-Up Failed: Please check your details and try again.");
    } finally {
      setLoading(false);
      navigation.navigate("home");
      setIndexBottom(0);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -500} // Adjust the offset as needed
    >
      <Text style={[styles.title, {color: theme.colors.onBackground}]}>Sign Up</Text>
      <TextInput
        style={[styles.input, {color: theme.colors.onBackground}, {borderColor: theme.colors.onBackground}]}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
        placeholderTextColor={theme.colors.onBackground}
      />
      <TextInput
        style={[styles.input, {color: theme.colors.onBackground}, {borderColor: theme.colors.onBackground}]}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholderTextColor={theme.colors.onBackground}
      />
      <TextInput
        style={[styles.input, {color: theme.colors.onBackground}, {borderColor: theme.colors.onBackground}]}
        placeholder="Phone#"
        keyboardType="numeric" // Set keyboardType to "numeric"
        value={phone}
        onChangeText={setPhone}
        autoCapitalize="none"
        placeholderTextColor={theme.colors.onBackground}
      />
<Text style={{fontSize: 10, fontStyle: 'italic', marginBottom: 10, width: "80%", color: theme.colors.onBackground}}>Password must be at least 7 characters long and include at least one number, one uppercase letter, and one special character (!@#$%^&*). Example: Passw0rd!</Text>
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
      <View style={styles.passwordContainer}>
      <TextInput
        style={[styles.input, {color: theme.colors.onBackground}, {borderColor: theme.colors.onBackground}]}
        placeholder="Confirm Password"
        secureTextEntry={!passwordVisible}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
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
          <Button style={styles.button} mode="contained" onPress={handleSignup}>
            Sign Up
          </Button>
          {/* <Button style={styles.button} mode="contained" onPress={signIn}>
            Sign In
          </Button> */}
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
   // backgroundColor: "#fff",
    height: "100%", // Set a fixed height for the container
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    //color: "black",
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    width: "80%",
    paddingVertical: 10,
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
