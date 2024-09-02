import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Text, Platform,
  TouchableOpacity } from "react-native";
import { List, Divider, Button, TextInput, useTheme, IconButton } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { updatePassword, reauthenticateWithCredential, getAuth, EmailAuthProvider } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { updateDoc, doc } from "firebase/firestore";

const ChangePasswordScreen = ({  }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();
const theme = useTheme();
  const auth = getAuth();

  const handleChangePassword = async () => {
  try {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    updateUserPassword();
    Alert.alert("Success", "Password changed successfully.");
    navigation.goBack(); // Navigate back on success
  } catch (error) {
    //console.error("Error changing password:", error);
    Alert.alert("Error", "Failed to change password.");
  }
};




const updateUserPassword = async () => {
  const user = auth.currentUser
  try {
    const userDocRef = doc(FIRESTORE_DB, "Users", user.email );
    await updateDoc(userDocRef, { Password: newPassword });
    console.log("the password changed to"+ newPassword );
   // console.log('User address updated successfully');
  } catch (error) {
   // console.error('Error updating user Password: ', error);
  }
};

  return (

    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <List.Section style={styles.listSection}>
            <List.Item
              title="Password"
              description={currentPassword}
              left={() => <List.Icon icon="lock" />}
            />
            <TextInput
              secureTextEntry
              placeholder="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <Divider />
            <List.Item
              title="New Password"

              left={() => <List.Icon icon="lock" />}
            />
            <Text style={{fontSize: 10, fontStyle: 'italic', marginBottom: 10, color: theme.colors.onBackground}}>Password must be at least 7 characters long and include at least one number, one uppercase letter, and one special character (!@#$%^&*). Example: Passw0rd!</Text>
            <TextInput
              secureTextEntry={!passwordVisible}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
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
            <Divider />
            <List.Item
              title="Confirm New Password"
              left={() => <List.Icon icon="lock" />}
            />
            <TextInput
              secureTextEntry={!passwordVisible}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
             <TouchableOpacity
         style={{position: "absolute",
    right: 10,
    height: "185%",
    justifyContent: "center",}}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
         <IconButton
            icon={passwordVisible ? "eye" : "eye-off"}
            color={theme.colors.onBackground}
            size={20}
          />
        </TouchableOpacity>
            <Divider />
          </List.Section>
          <Button
            style={{ margin: 15 }}
           // contentStyle={{ color: "white" }}
            onPress={handleChangePassword}
            mode="contained"
          >
            Confirm Changed Password
          </Button>
        </ScrollView>
      </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  listSection: {
    marginBottom: 16,
  },
  icon: {
    position: "absolute",
    right: 10,
    height: "125%",
    justifyContent: "center",
  },
});

export default ChangePasswordScreen;
