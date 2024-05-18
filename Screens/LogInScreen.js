import * as React from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { signInWithEmailAndPassword, getAuth} from "firebase/auth"; // Corrected import
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import useAppStore from "../useAppStore";


const LogInScreen = () => {
  const {name, setName, phone, setPhone, address, setAddress, indexBottom  , setIndexBottom, user, setUser, visible, setVisible, email, setEmail} = useAppStore();
   const [password, setPassword] = useState("");
    
  const [loading, setLoading] = React.useState(false);
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation(); // Added navigation

 
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
                  onPress: () => console.log("OK Pressed"),
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
              onPress: () => console.log("OK Pressed"),
            },
          ]
        );
      }
    } catch (error) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
      //navigation.navigate('account');
       // setIndex(1);
    }
  };

  
  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -500}
    >
      <Text style={styles.title}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <>
          <Button style={styles.button} mode="contained" onPress={signIn}>
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
    backgroundColor: "#fff",
    height: "100%",
    paddingTop: 100
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
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
    paddingVertical: -25,
  },
});
