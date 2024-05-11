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
import { signInWithEmailAndPassword } from "firebase/auth"; // Corrected import
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { useBottomNavigationVisible, usePageIndex, useEmail, usePassword, useUser} from "../useAppStore";


const LogInScreen = () => {
 const [email  , setEmail ] = useEmail(state => [state.email, state.setEmail]);
 const [password, setPassword] = useState("");
    
  const [loading, setLoading] = React.useState(false);
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation(); // Added navigation

 



  const [visible  , setVisible ] = useBottomNavigationVisible(state => [state.visible, state.setVisible]);
  const [index  , setIndex ] = usePageIndex(state => [state.index, state.setIndex]);
  useFocusEffect(
    React.useCallback(() => {
      setVisible(true); // Ensure bottom navigation is visible when HomeScreen is focused
      setIndex(1);
      return () => {
        // Clean-up function when screen loses focus (optional)
      };
    }, [])
  );

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      navigation.navigate('account');
    } catch (error) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
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
