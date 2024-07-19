import * as React from "react";
import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import useAppStore from "../useAppStore";
import { Button, Card } from "react-native-paper";

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
    <Card style={styles.card}>
      <Card.Title title={item.title} />
      <Card.Content>
        <Text variant= "displayLarge">{item.description}</Text>
      </Card.Content>
      <Card.Cover
        source={item.image}
        resizeMode="cover"
        style={styles.cardImage}
      />
      <Card.Actions style={styles.cardAction}>
        <Button
style={{width: 'auto',  }}
labelStyle={{fontSize: 12, letterSpacing: 1}}
          uppercase={true}
          mode= 'text'
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
        numColumns={2}

        columnWrapperStyle={{ justifyContent: 'space-between' }} // Add this line
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
   // padding: 5,
  },
  card: {
    flex: 0.5,
    borderWidth: 1,
    backgroundColor: "#F3E9F9",
    margin: 5,
    height: 250,
  },
  cardAction: {
    alignItems: "center",
    alignSelf: "center",
    alignContent: "center",
    bottom: 80,


  },

  cardImage: {
    backgroundColor: "#F3E9F9",
    bottom: 35,
   // borderWidth: 1,
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
  logo: {
    tintColor: "black",
    height: 100,
    width: 100,
    alignSelf: "center",
    marginBottom: -90,
    left: -15,
    bottom: 100,
  },
  flatList: {
    marginBottom: 5,
  },
});

export default HomeScreen;
