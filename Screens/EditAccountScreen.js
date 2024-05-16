import React, { useEffect, useState } from "react";
import { View, StyleSheet, BackHandler, ScrollView, Alert, Text } from "react-native";
import { List, Divider, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { firebase } from "firebase/compat/app";
import { reauthenticateWithCredential, updatePassword } from "firebase/auth";
import {
  doc,
  getDocs,
  setDoc,
  collection,
  updateDoc,
} from "firebase/firestore";
import useAppStore from "../useAppStore";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LogInScreen from "./LogInScreen";
import { TextInput } from "react-native-gesture-handler";

const EditAccountScreen = () => {
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;
  const {name, setName, phone, setPhone, address, setAddress, indexBottom  , setIndexBottom, user, setUser, visible, setVisible, email, setEmail} = useAppStore();
  const [userInfo, setUserInfo] = useState({});
    const [password, setPassword] = useState("");

  const handleConfirm = () => {
    navigation.goBack(); // Navigate back one page
  };

  useEffect(() => {
    setVisible(true); // Call setVisible(false) when the component mounts
    const backAction = () => true; // Prevent going back when on AccountScreen
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove(); // Clean up the event listener
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Update user state based on authentication status
    });
    return unsubscribe; // Clean up the subscription
  }, [auth]);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => navigation.navigate("login")) // Navigate to SignUpScreen after logout
      .catch((error) => console.error("Logout failed:", error));
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (!user || !user.emailVerified) {
          // If user is not logged in or email is not verified, return early
          return;
        }

        const userDocRef = collection(FIRESTORE_DB, "Users");
        
        const querySnapshot = await getDocs(userDocRef);
        const userData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .find((data) => data.userId === user.uid); // Assuming userId field in Firestore
        //  console.log(userData);
        if (userData) {
          setUserInfo(userData);
        } else {
          //   console.log("User data not found.");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [user]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    try {
      if (!auth.currentUser) {
        Alert.alert("Error", "User not authenticated.");
        return;
      }
      if (newPassword !== confirmPassword) {
        Alert.alert("Error", "New passwords do not match.");
        return;
      }
      const user = auth.currentUser;

      const credential = firebase.auth.EmailAuthProvider.credential(
        email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential, currentPassword);

      await updatePassword(user, newPassword);
      Alert.alert("Success", "Password changed successfully.");
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "Failed to change password.");
    }
  };

  const updateUserProfile = async () => {
    try {
      const userDocRef = doc(FIRESTORE_DB, "Users", userInfo.id);
      const updates = {}; // Create an empty object for updates

      // Check if name is changed and add it to updates object
      if (name !== userInfo.Name) {
        updates.Name = name;
      }

      // Check if phone is changed and add it to updates object
      if (phone !== userInfo.Phone) {
        updates.Phone = phone;
      }

      // Update the document in Firestore with the updates object
      await updateDoc(userDocRef, updates);

      console.log("User profile updated successfully.");
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  if (!user || !user.emailVerified) {
    return <LogInScreen />;
  }

  return (
    
      <View style={{ paddingTop: 75 }}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <List.Section style={styles.listSection}>
              <List.Item
                title="Name"
                description={userInfo.Name} // Assuming user has a displayName
                left={() => <List.Icon icon="account-circle" />}
              />
              <TextInput
                placeholder="Enter new name"
                inputMode="text"
                onChangeText={(text) => setName(text)}
                onBlur={updateUserProfile} // Update the user profile when the input field loses focus
              />
              <Divider />
              <List.Item
                title="Phone Number"
                description={userInfo.Phone} // Assuming user has a phoneNumber
                left={() => <List.Icon icon="phone" />}
              />
              <TextInput
                placeholder="Enter new phone"
                inputMode="numeric"
                onChangeText={(text) => setPhone(text)}
                onBlur={updateUserProfile} // Update the user profile when the input field loses focus
              />
              <Divider />
              <List.Item
                title="Password"
                description={currentPassword}
                left={() => <List.Icon icon="phone" />}
              />
              
              {/* <TextInput  secureTextEntry
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword} />
         <TextInput
         
        secureTextEntry
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      /> */}
              <Button
                style={{ marginHorizontal: 50, alignSelf: 'center', right: 110, bottom: -10, marginTop: -25 }}
                contentStyle={{ color: "white" }} // Use contentStyle to style the text of the button
                onPress={ () => navigation.navigate("changePassword")}
                mode="text"
              >
                Change Password
              </Button>

              <Divider />
              <List.Item
                title="Email"
                description={userInfo.Email}
                left={() => <List.Icon icon="email" />}
                disabled // Add disabled prop
                style={{ opacity: 0.6 }} // Adjust opacity to make it look pale
              />

              <Divider />
            </List.Section>
            <Text style={{fontSize: 10, fontStyle: 'italic', marginBottom: 10, width: "90%"}}>Please allow some time for updated information to appear on your account.</Text>
            <Button
              labelStyle={{
                fontSize: 20,
                alignSelf: "center",
                textAlignVertical: "center",
              }}
              style={{
                margin: 25,
                height: 50,
                width: 150,
                justifyContent: "center", // Center the text horizontally
                alignItems: "center", // Center the text vertically
                alignSelf: "center",
              }}
              mode="contained"
              onPress={handleConfirm}
            >
              Confirm
            </Button>

            {/* <List.Section style={styles.listSection}>
              <List.Subheader>Settings</List.Subheader>
              <List.Item
                title="Edit Account"
                left={() => <List.Icon icon="account-edit" />}
                onPress={() => {}}
              />
              <Divider />
              <List.Item
                title="Notification Settings"
                left={() => <List.Icon icon="bell" />}
                onPress={() => {}}
              />
              <Divider /> */}
            {/* <List.Item
                title="Set Password"
                left={() => <List.Icon icon="lock" />}
                onPress={() => {}}
              />
              <Divider /> */}
            {/* <List.Item
                title="Saved Addresses"
                left={() => <List.Icon icon="map-marker" />}
                onPress={() => {}}
              />
              <Divider /> */}
            {/* <List.Item
                title="Dark Mode"
                left={() => <List.Icon icon="theme-light-dark" />}
                onPress={() => {}}
              />
              <Divider />
              <List.Item
                title="Log Out"
                left={() => <List.Icon icon="logout" />}
                onPress={handleLogout}
              />
            </List.Section> */}
          </View>

          {/* <View style={styles.footer}>
            <Button
              style={{ alignSelf: "flex-start" }}
              icon="file-document-outline"
              mode="text"
              onPress={() => {}}
            >
              Terms of Service
            </Button>
            <Button
              style={{ alignSelf: "flex-start" }}
              icon="shield"
              mode="text"
              onPress={() => {}}
            >
              Privacy Control
            </Button>
            <Button
              style={{ alignSelf: "flex-start" }}
              icon="help-circle-outline"
              mode="text"
              onPress={() => {}}
            >
              FAQs
            </Button>
          </View> */}
        </ScrollView>
      </View>
    
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listSection: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 16,
  },
  footer: {
    flexDirection: "column",
    //alignSelf: 'flex-start',
    //paddingHorizontal: 16,
  },
});

export default EditAccountScreen;
