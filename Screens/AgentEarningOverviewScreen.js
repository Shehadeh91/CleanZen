import React, { useEffect, useState } from "react";
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
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const AgentEarningOverviewScreen = () => {
  const [agentData, setAgentData] = useState(null);


useEffect(()=> {
fetchAgentData()
})


  const fetchAgentData = async () => {
    try {
      // Assuming you have initialized Firebase and Firestore
      const user = FIREBASE_AUTH.currentUser;
      // Fetch the agent's document using their email
      const agentDocRef = doc(FIRESTORE_DB, "Agents", user.email); // Replace userEmail with the agent's email
      const agentDocSnap = await getDoc(agentDocRef);

      if (agentDocSnap.exists()) {
        // Extract agent's data from the document snapshot
        const data = agentDocSnap.data();
        setAgentData(data); // Call setAgentData with the new value



      } else {
        console.log("Agent document does not exist");
      }
    } catch (error) {
      console.error("Error fetching agent's data:", error);
    }
  };


  return (
    <View style={{ paddingTop: 75 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 25,
          marginTop: 25,
        }}
      >
        <Avatar.Image size={100} source={require("./agentFace.png")} />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{agentData ? agentData.Name : ""}</Text>
          <Text style={{ fontSize: 13 }}> {agentData ? agentData.Phone : ""}</Text>
          <Text style={{ fontSize: 13 }}> {agentData ? agentData.Email : ""}</Text>

        </View>
      </View>
             <View
          style={{
            margin: 15,
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 10,
            marginTop: 25,
          }}
        >
          <Card style={{ borderWidth: 0.5 }}>
            <Card.Title
              leftStyle={{ alignItems: "center", top: 5 }}
              title="Completed Services"
              subtitleStyle={{paddingHorizontal: 5}}
              subtitle={agentData ? agentData.NumberOfServices : ""}
              left={(props) => (
                <Avatar.Image source={require("./completed Services.png")} />
              )}
            />
            <Card.Actions style={{ alignSelf: "center" }}></Card.Actions>
          </Card>
          <Card style={{ borderWidth: 0.5 }}>
            <Card.Title
              leftStyle={{ alignItems: "center", top: 5 }}
              title="Total Earnings"
              subtitleStyle={{paddingHorizontal: 5, letterSpacing: 2}}
              subtitle={agentData ? "$" + (agentData.TotalEarnings * 0.75).toFixed(2) : ""}
              left={(props) => (
                <Avatar.Image source={require("./GrossEarnings.png")} />
              )}
            />
            <Card.Actions style={{ alignSelf: "center" }}></Card.Actions>
            <Text style={{fontStyle:'italic', fontSize: 10, paddingHorizontal: 10}}>Your earnings will be deposited into your bank account every Sunday.</Text>
          </Card>

          {/* <Card style={{borderWidth: 0.5}}>
            <Card.Title
            leftStyle={{alignItems: 'center', top: 5}}

              title="Expenses, Fees and Tax"
              subtitle="Card Subtitle"

              left={(props) => (
                <Avatar.Image source={require("./Taxes.png")} />
              )}
            />
            <Card.Actions style={{ alignSelf: "center" }}></Card.Actions>
          </Card> */}
          {/* <Card style={{ borderWidth: 0.5 }}>
            <Card.Title
              leftStyle={{ alignItems: "center", top: 5 }}
              title="Total Paid"
              subtitleStyle={{paddingHorizontal: 5, letterSpacing: 2}}
              subtitle= "e"
              source={require("../Screens/EarningOverview.png")}
              left={(props) => (
                <Avatar.Image source={require("./NetPayout.png")} />
              )}
            />
            <Card.Actions style={{ alignSelf: "center" }}></Card.Actions>
          </Card> */}
        </View>
        <ScrollView>
        <View style={{borderWidth: 1, flexDirection: 'column',
          alignItems: "center",
          marginHorizontal: 20}}>
 {agentData && agentData.Invoices ? (
      agentData.Invoices.map((invoice, index) => (
        <View key={index} style={{ marginTop: 10 }}>
          <Text>Invoice {index + 1}</Text>
          <Text>Start Date: {invoice["Start Date"] ? invoice["Start Date"].toDate().toLocaleString() : "N/A"}</Text>
          <Text>End Date: {invoice["End Date"] ? invoice["End Date"].toDate().toLocaleString() : "N/A"}</Text>
          <Text>Amount: {invoice.Amount}</Text>
        </View>
      ))
    ) : (
      <Text>No invoices found</Text>
    )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default AgentEarningOverviewScreen;
