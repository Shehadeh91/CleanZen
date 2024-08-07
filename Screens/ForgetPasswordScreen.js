import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import { sendPasswordResetEmail, getAuth } from "firebase/auth";

const ForgetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState(""); // State to store the email

  const auth = getAuth(); // Get the authentication instance
const theme = useTheme();
  const handleSendEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, email); // Function to send password reset email
      Alert.alert("Success", "Password reset email sent successfully.");
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
     // console.error("Error sending email:", error);
      Alert.alert("Error", "Failed to send password reset email.");
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleSendEmail}
        style={styles.button}
        background={theme.colors.primary}
      >
        Send Reset Password
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
});

export default ForgetPasswordScreen;
