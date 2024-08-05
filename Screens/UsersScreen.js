import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  BackHandler,
} from "react-native";
import { Button, Icon, MD3Colors, useTheme } from "react-native-paper";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import LogInScreen from "./LogInScreen";
import useAppStore from "../useAppStore";
import { collection, query, getDocs, Firestore } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { Swipeable } from "react-native-gesture-handler";

import { doc, getDoc, setDoc } from "firebase/firestore";

const UsersScreen = () => {
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;
  const {name, setName, phone, setPhone, address, setAddress, indexBottom  , setIndexBottom, user, setUser, visible, setVisible, email, setEmail} = useAppStore();
    const [orders, setOrders] = useState([]);
  const [showClients, setShowClients] = useState(true);
  const [showAgents, setShowAgents] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false);
  const [highlightedButton, setHighlightedButton] = useState("Client");
  const [client, setClient] = useState([]);
  const [agent, setAgent] = useState([]);
  const [admin, setAdmin] = useState([]);

  const swipeableRef = useRef(null);

  const filterOrders = (role) => client.filter((users) => users.Role === role);

  const handleButtonPress = (role) => {
    setShowClients(role === "Client");
    setShowAgents(role === "Agent");
    setShowAdmins(role === "Admin");
    setHighlightedButton(role);
  };

  useEffect(() => {
    //setVisible(true); // Call setVisible(false) when the component mounts
    const backAction = () => true; // Prevent going back when on AccountScreen
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove(); // Clean up the event listener
  }, []);

  useEffect(() => {
    let isMounted = true; // Flag to track component mount state

    const fetchOrders = async () => {
      try {
        if (!user || !user.email) {
          //console.error("User is not logged in or has no email.");
          return;
        }

        const ordersRef = collection(FIRESTORE_DB, "Users");
        const querySnapshot = await getDocs(ordersRef);

        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter orders by user's email
        // const userOrders = data.filter((users) => users.Email === user.email);

        if (isMounted) {
          // Update state by reversing the users of new orders
          setClient(data.filter((users) => users.Role === "Client").reverse());
          setAgent(data.filter((users) => users.Role === "Agent").reverse());
          setAdmin(data.filter((users) => users.Role === "Admin").reverse());
        }
      } catch (error) {
        //console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false on unmount
    };
  }, [user]);
const theme = useTheme();

  const changeToAgent = async (orderId) => {
    try {
      const orderRef = doc(FIRESTORE_DB, "Users", orderId);
      await setDoc(orderRef, { Role: "Agent" }, { merge: true });
     // console.log("Order marked as Agent.");
      if (swipeableRef.current) {
        swipeableRef.current.close(); // Close the Swipeable component
      }
      // Update state after canceling the users
      setAgent((prevOrders) => [...prevOrders, ...client]);
      setClient([]); // Clear the client array after moving all users to agent


    } catch (error) {
      //console.error("Error marking users as Agent:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, [auth]);

  if (!user || !user.emailVerified) {
    return <LogInScreen />;
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.secondary}]}>
      <View style={styles.buttonsContainer}>
        <Button
          mode="text"
          onPress={() => handleButtonPress("Client")}
          style={[
            styles.button,
            highlightedButton === "Client" && styles.highlightedButton,
          ]}
          labelStyle={{
            fontSize: 15,
            width: "100%",
            height: "100%",
            textAlign: "center",
            alignSelf: "center",
            verticalAlign: "middle",
            letterSpacing: 3,
          }}
        >
          Clients
        </Button>
        <Button
          mode="text"
          onPress={() => handleButtonPress("Agent")}
          style={[
            styles.button,
            highlightedButton === "Agent" && styles.highlightedButton,
          ]}
          labelStyle={{
            fontSize: 15,
            width: "100%",
            height: "100%",
            textAlign: "center",
            alignSelf: "center",
            verticalAlign: "middle",
            letterSpacing: 3,
          }}
        >
          Agents
        </Button>
        <Button
          mode="text"
          onPress={() => handleButtonPress("Admin")}
          style={[
            styles.button,
            highlightedButton === "Admin" && styles.highlightedButton,
          ]}
          labelStyle={{
            fontSize: 15,
            width: "100%",
            height: "100%",
            textAlign: "center",
            alignSelf: "center",
            verticalAlign: "middle",
            letterSpacing: 3,
          }}
        >
          Admins
        </Button>
      </View>
      {showClients && (
        <ScrollView style={styles.ordersList}>
          {client.map((users) => (
            <Swipeable
              key={users.id} // Add key prop here
              ref={swipeableRef}
              rightThreshold={100}
              on
              renderRightActions={() => (
                <View
                  key={users.id}
                  style={{ justifyContent: "center", width: 225, borderWidth: 1 }}
                >
                  <Button
                    mode="contained"
                    onPress={() => changeToAgent(users.id)}
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      backgroundColor: "#C6373C",
                      borderRadius: 0,
                    }}
                  >
                    Become An Agent
                  </Button>
                </View>
              )}
            >
              <View style={styles.orderItem}>
                <Text style={{ fontSize: 13, color: 'red' }}>Email: {users.Email}</Text>
                <Text style={{ fontSize: 13 }}>Name: {users.Name}</Text>
                <Text style={{ fontSize: 13 }}>Number: {users.Phone}</Text>
              </View>
            </Swipeable>
          ))}
        </ScrollView>
      )}
      {showAgents && (
        <ScrollView style={styles.ordersList}>
          {agent.map((users) => (
            <View key={users.id}>
              <View style={styles.orderItem}>

                <Text style={{ fontSize: 13, color: 'red' }}>Email: {users.Email}</Text>
                <Text style={{ fontSize: 13 }}>Name: {users.Name}</Text>
                <Text style={{ fontSize: 13 }}>Number: {users.Phone}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      {showAdmins && (
        <ScrollView style={styles.ordersList}>
          {admin.map((users) => (
            <View key={users.id}>
              <View style={styles.orderItem}>
                <Text style={{ fontSize: 13, color: 'red' }}>Email: {users.Email}</Text>
                <Text style={{ fontSize: 13 }}>Name: {users.Name}</Text>
                <Text style={{ fontSize: 13 }}>Number: {users.Phone}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 10,
    alignItems: "center",
    paddingTop: 75,
    paddingHorizontal: 10,
    paddingBottom: 25,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,

    width: 350,
  },
  button: {
    width: 100,
    textAlign: "center",
    borderRadius: 0,
  },
  highlightedButton: {
    backgroundColor: "black",
  },
  ordersList: {
    width: "100%",
    height: "70%",
    // borderWidth: 2,
    borderColor: "black",
    // marginBottom: 10,
    // backgroundColor: "#D8BFD8",
  },
  orderItem: {
    //padding: 3,
    flexDirection: "column",
    gap: 5,
    borderBottomWidth: 3,
    borderBottomColor: "#DDDDDD",
    backgroundColor: "#F3E9F9",
  },
});

export default UsersScreen;
