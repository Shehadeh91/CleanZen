import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Text } from "react-native";
import { List, Divider, Button, TextInput } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { updatePassword, reauthenticateWithCredential, getAuth, EmailAuthProvider } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const ChangePasswordScreen = ({  }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();

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

    Alert.alert("Success", "Password changed successfully.");
    navigation.goBack(); // Navigate back on success
  } catch (error) {
    //console.error("Error changing password:", error);
    Alert.alert("Error", "Failed to change password.");
  }
};

  return (
    
      <View style={styles.container}>
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
            <Text style={{fontSize: 10, fontStyle: 'italic', marginBottom: 10}}>Password must be at least 7 characters long and include at least one number, one uppercase letter, and one special character (!@#$%^&*). Example: Passw0rd!</Text>
            <TextInput
              secureTextEntry
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <Divider />
            <List.Item
              title="Confirm New Password"
              left={() => <List.Icon icon="lock" />}
            />
            <TextInput
              secureTextEntry
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <Divider />
          </List.Section>
          <Button
            style={{ margin: 15 }}
            contentStyle={{ color: "white" }}
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
    paddingTop: 75 
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  listSection: {
    marginBottom: 16,
  },
});

export default ChangePasswordScreen;
