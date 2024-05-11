import React, { useEffect, useState } from "react";
import { View, StyleSheet, BackHandler, ScrollView } from "react-native";
import { List, Divider, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDocs, setDoc, collection } from "firebase/firestore";
import {
  useBottomNavigationVisible,
  useUser,
  useEmail,
  usePassword,
  useName,
  usePhone,
} from "../useAppStore";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LogInScreen from "./LogInScreen";

const AccountScreen = () => {
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;
  const [user, setUser] = useUser((state) => [state.user, state.setUser]);
  const [visible, setVisible] = useBottomNavigationVisible((state) => [
    state.visible,
    state.setVisible,
  ]);
  const [userInfo, setUserInfo] = useState({});

  const [name, setName] = useName((state) => [state.name, state.setName]);

  //const [name, setName] = useState("");
  const [phone, setPhone] = usePhone((state) => [state.phone, state.setPhone]);
  const [email, setEmail] = useEmail((state) => [state.email, state.setEmail]);
  const [password, setPassword] = useState("");

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
        if (!user) return;

        const userDocRef = collection(FIRESTORE_DB, "Users");
        const querySnapshot = await getDocs(userDocRef);
        const userData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .find((data) => data.userId === user.uid); // Assuming userId field in Firestore
        console.log(userData);
        if (userData) {
          setUserInfo(userData);
        } else {
          console.log("User data not found.");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, [user]);

  if (!user) {
    return <LogInScreen />;
  }

  return (
    
      <View style={{ paddingTop: 75 }}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.container}>
            <List.Section style={styles.listSection}>
              <List.Subheader>User Info</List.Subheader>
              <List.Item
                title="Name"
                description={userInfo.Name} // Assuming user has a displayName
                left={() => <List.Icon icon="account-circle" />}
              />
              <Divider />
              <List.Item
                title="Phone Number"
                description={userInfo.Phone} // Assuming user has a phoneNumber
                left={() => <List.Icon icon="phone" />}
              />
              <Divider />
              <List.Item
                title="Email"
                description={userInfo.Email}
                left={() => <List.Icon icon="email" />}
              />
              <Divider />
            </List.Section>

            <List.Section style={styles.listSection}>
              <List.Subheader>Settings</List.Subheader>
              <List.Item
                title="Edit Account"
                left={() => <List.Icon icon="account-edit" />}
                onPress={() => {navigation.navigate("edit")}}
              />
              <Divider />
              {/* <List.Item
                title="Notification Settings"
                left={() => <List.Icon icon="bell" />}
                onPress={() => {navigation.navigate("notificationSettings")}}
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
                onPress={() => {navigation.navigate("darkMode")}}
              />
              <Divider /> */}
              <List.Item
                title="Log Out"
                left={() => <List.Icon icon="logout" />}
                onPress={handleLogout}
              />
            </List.Section>
          </View>

          <View style={styles.footer}>
            <Button
              style={{ alignSelf: "flex-start" }}
              icon="file-document-outline"
              mode="text"
              onPress={() => {navigation.navigate("termOfService")}}
            >
              Terms of Service
            </Button>
            <Button
              style={{ alignSelf: "flex-start" }}
              icon="shield"
              mode="text"
              onPress={() => {navigation.navigate("privacyControl")}}
            >
              Privacy Control
            </Button>
            {/* <Button
              style={{ alignSelf: "flex-start" }}
              icon="help-circle-outline"
              mode="text"
              onPress={() => {}}
            >
              FAQs
            </Button> */}
          </View>
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

export default AccountScreen;
