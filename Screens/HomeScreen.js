import * as React from "react";
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import useAppStore from "../useAppStore";
import { Card } from "react-native-paper";

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { setVisible } = useAppStore();

  useFocusEffect(
    useCallback(() => {
      setVisible(true);
      return () => {};
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => {
        navigation.navigate(item.screen);
        setVisible(false);
      }}
    >
      <Card style={styles.card}>
        <Card.Title title={item.title} />
        <Card.Content>
          <Text variant="displayLarge">{item.description}</Text>
        </Card.Content>
        <Card.Cover
          source={item.image}
          resizeMode="cover"
          style={styles.cardImage}
        />
      </Card>
    </TouchableOpacity>
  );

  const data = [
    {
      id: "1",
      title: "Hand Car Wash",
      image: require("./CarClean.png"),
      screen: "carWash",
    },
    {
      id: "2",
      title: "House Cleaning",
      image: require("./HouseClean.png"),
      screen: "roomClean",
    },
    // {
    //   id: "3",
    //   title: "Dry Cleaning",
    //   image: require("./DryClean.png"),
    //   screen: "dryClean",
    // },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PureCare</Text>
      <Text style={styles.subTitle}>Anywhere, Anytime</Text>
      <Image
        style={styles.logo}
        resizeMode="center"
        resizeMethod="auto"
        source={require("./PureCare.png")}
      />
      <FlatList
        style={styles.flatList}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  cardContainer: {
    marginBottom: 35,

  },
  card: {
    backgroundColor: "#F3E9F9",
    borderRadius: 15,
    height: 250, // Adjusted height for the card

  },
  cardImage: {
    backgroundColor: "#F3E9F9",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginTop: 25,
    paddingLeft: 10,
  },
  subTitle: {
    fontSize: 20,
    color: "black",
    paddingLeft: 10,
    letterSpacing: 4,
  },
  logo: {
    tintColor: "black",
    height: height * 0.1, // Adjusts height relative to screen height
    width: width * 0.25,  // Adjusts width relative to screen width
    alignSelf: "center",
    marginBottom: -height * 0.08,
    bottom: height * 0.1125,
  },
  flatList: {
    marginBottom: 5,
  },
});

export default HomeScreen;
