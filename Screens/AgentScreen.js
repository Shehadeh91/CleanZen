import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  Title,
  Paragraph,
  Button,
  Card,
  Avatar,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FIREBASE_AUTH } from "../FirebaseConfig";

const AgentScreen = () => {
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => navigation.navigate("login")) // Navigate to SignUpScreen after logout
     // .catch((error) => console.error("Logout failed:", error));
  };

  return (
    <View style={{ paddingTop: 75 }}>
    <ScrollView>
      <View style={{ margin: 15, flexDirection: 'column', justifyContent: 'space-between', gap: 25 }}>
      {/* <Card style={{borderRadius: 15 }}>
          <Card.Cover
            style={{borderRadius: 0, borderTopRightRadius: 15, borderTopLeftRadius: 15}}
            resizeMode="cover"
            source={require("../Screens/ManageUsers.png")}
          />
          <Card.Actions style={{ alignSelf: "center" }}>
            <Button
              icon="human-queue"
              mode="text"
              onPress={() => navigation.navigate("users")}

            >
              Manage Users
            </Button>
          </Card.Actions>
        </Card> */}
        <Card style={{borderRadius: 15 }}>
          <Card.Cover
            style={{borderRadius: 0, borderTopRightRadius: 15, borderTopLeftRadius: 15}}
            resizeMode="cover"
            source={require("../Screens/EarningOverview.png")}
          />
          <Card.Actions style={{ alignSelf: "center" }}>
            <Button
              icon="account-cash"
              mode="text"
              onPress={() => navigation.navigate("earningOverview")}
            >
              Earnings Overview
            </Button>
          </Card.Actions>
        </Card>
        <Card style={{borderRadius: 15 }}>
          <Card.Cover
            style={{borderRadius: 0, borderTopRightRadius: 15, borderTopLeftRadius: 15}}
            resizeMode="cover"
            source={require("../Screens/ManageOrders.png")}
          />
          <Card.Actions style={{ alignSelf: "center" }}>
            <Button
              icon="room-service"
              mode="text"
              onPress={() => navigation.navigate("agentOrders")}
            >
              Manage Orders
            </Button>
          </Card.Actions>
        </Card>
        <Card style={{borderRadius: 15 }}>
          <Card.Cover
             style={{borderRadius: 0, borderTopRightRadius: 15, borderTopLeftRadius: 15}}
            resizeMode="cover"
            source={require("../Screens/Logout.png")}
          />
          <Card.Actions style={{ alignSelf: "center" }}>
            <Button
              icon="logout"
              mode="text"
              onPress={handleLogout}
            >
              LogOut
            </Button>
          </Card.Actions>
        </Card>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default AgentScreen;
