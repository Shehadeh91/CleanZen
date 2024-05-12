import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
} from "react-native";

import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Added import
import { useEffect } from "react";
import { useBottomNavigationVisible } from "../useAppStore";
import { Avatar, Button, Card } from "react-native-paper";

const HomeScreen = () => {
  const navigation = useNavigation(); // Added navigation hook
  const [visible, setVisible] = useBottomNavigationVisible((state) => [
    state.visible,
    state.setVisible,
  ]);

  useFocusEffect(
    React.useCallback(() => {
      setVisible(true); // Ensure bottom navigation is visible when HomeScreen is focused
      return () => {
        // Clean-up function when screen loses focus (optional)
      };
    }, [])
  );

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.title} />
      <Card.Content>
        <Text variant="bodyMedium">{item.description}</Text>
      </Card.Content>
      <Card.Cover
        source={item.image}
        resizeMode="cover"
        style={{ backgroundColor: "#F3E9F9" }}
      />
      <Card.Actions style={styles.cardAction}>
        <Button
          style={styles.button}
          uppercase={true}
          mode="contained"
          onPress={() => {
            navigation.navigate(item.screen);
            setVisible(false);
          }}
        >
          Start
        </Button>
      </Card.Actions>
    </Card>
  );

  const data = [
    {
      id: "1",
      title: "CAR WASH",
      description:
        "Experience the best in car care with our express hand car wash service. We provide thorough cleaning, tire shine for a sleek appearance, deep tire cleaning for safety, a protective polymer layer for your car's body, and a professional towel dry. Choose our Car Wash service for ultimate car care and protection.",
      image: require("./CarClean.png"),
      screen: "carWash",
    },
    {
      id: "2",
      title: "HOUSE/APARTMENT CLEAN",
      description:
        "Discover the convenience of our house cleaning service. We offer comprehensive cleaning solutions for every corner of your home, including dusting, vacuuming, mopping, kitchen and bathroom sanitation, and trash removal. Choose our House Cleaning service for a spotless and inviting living space.",
      image: require("./HouseClean.png"),
      screen: "carWash",
    },
    {
      id: "3",
      title: "DRY CLEAN",
      description:
        "Experience the ease of our dry cleaning service. We provide professional care for your delicate garments, ensuring they remain fresh, clean, and impeccably pressed. From formal wear to everyday clothing, trust our Dry Cleaning service for garments that look and feel brand new.",
      image: require("./DryClean.png"),
      screen: "carWash",
    },
  
    {
      id: "4",
      title: "CARPET CLEAN",
      description:
        "Revitalize your carpets with our professional cleaning service. Our experts employ advanced techniques to remove deep-seated dirt, stains, and allergens, leaving your carpets looking vibrant and smelling fresh. Choose our Carpet Cleaning service for a healthier and more inviting home environment.",
      image: require("./CarpetClean.png"),
      screen: "carWash",
    },
    // Add more data items as needed
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PureCare</Text>
      <Text style={styles.subTitle}>Anywhere, Anytime</Text>
      <FlatList
        style={{ marginBottom: 5, marginHorizontal: 5 }}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderColor: 'black',
    // borderWidth: 1,
    backgroundColor: "white",
  },

  card: {
    borderWidth: 2,
    backgroundColor: "#F3E9F9",
    margin: 5,
    //height: "30%",
    //width: '50%',
    height: "auto",
    width: "auto",
  },
  cardAction: {
    alignItems: "center",
    alignSelf: "center",
    alignContent: "center",

    //bottom: 15,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "contain",
    justifyContent: "flex-end",
  },
 
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginTop: 50,
    paddingLeft: 10,
  },
  subTitle: {
    fontSize: 20,
    color: "black",
    paddingLeft: 10,
    letterSpacing: 4,
  },
  button: {},
});

export default HomeScreen;
