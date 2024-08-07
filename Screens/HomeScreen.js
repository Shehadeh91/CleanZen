import * as React from "react";
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import useAppStore from "../useAppStore";
import { Card, useTheme } from "react-native-paper";


const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { setVisible } = useAppStore();

  const theme = useTheme();

  useFocusEffect(
    useCallback(() => {
      setVisible(true);
      return () => {};
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.cardContainer, {backgroundColor: theme.colors.background}]}
      onPress={() => {
        navigation.navigate(item.screen);
        setVisible(false);
      }}
    >
       <Card style={[styles.card, { backgroundColor: theme.colors.background, borderColor: theme.colors.onBackground }]}>
        <Card.Title title={item.title} />
        <Card.Content>
          <Text variant="displayLarge">{item.description}</Text>
        </Card.Content>
        <Card.Cover
          source={item.image}
          resizeMode="cover"
          style={[styles.cardImage, {backgroundColor: theme.colors.background}]}
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
    <View style={{backgroundColor: theme.colors.background, flex: 1}}>



      <Text style={[styles.title, {color: theme.colors.onBackground}]}>PureCare</Text>
      <Text style={[styles.subTitle , {color: theme.colors.onBackground}]}>Anywhere, Anytime</Text>
      <Image
        style={[styles.logo, {tintColor: theme.colors.background}]}
        resizeMode="center"
        resizeMethod="auto"
        source={require("./PureCare.png")}
      />
       <View  style={[styles.cardContainer, {backgroundColor: theme.colors.background}]}>
      <FlatList
        style={styles.flatList}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
      />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {


  },
  cardContainer: {


  },
  card: {
   // backgroundColor: "#F3E9F9",
    borderRadius: 15,
    height: 250, // Adjusted height for the card
    margin: 10,
    borderWidth: 0.5
   // justifyContent: 'center', // Center items vertically
   // alignItems: 'center', // Center items horizontally

  },
  cardImage: {
    margin: 10,
    borderRadius: 15,
   borderBottomEndRadius: 15,
top: -35
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",

    marginTop: 25,
    paddingLeft: 10,
  },
  subTitle: {
    fontSize: 20,

    paddingLeft: 10,
    letterSpacing: 4,
  },
  logo: {

    height: height * 0.1, // Adjusts height relative to screen height
    width: width * 0.25,  // Adjusts width relative to screen width
    alignSelf: "center",
    marginBottom: -height * 0.08,
    bottom: height * 0.1125,
  },
  flatList: {
margin: 10,

  },
});

export default HomeScreen;
