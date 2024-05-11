import * as React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation,  useFocusEffect } from '@react-navigation/native'; // Added import
import { useEffect } from 'react';
import { useBottomNavigationVisible } from '../useAppStore';




const HomeScreen = () => {
  const navigation = useNavigation(); // Added navigation hook
  const [visible  , setVisible ] = useBottomNavigationVisible(state => [state.visible, state.setVisible]);
  
  useFocusEffect(
    React.useCallback(() => {
      setVisible(true); // Ensure bottom navigation is visible when HomeScreen is focused
      return () => {
        // Clean-up function when screen loses focus (optional)
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PureCare</Text>
      <Text style={styles.subTitle}>Anywhere, Anytime</Text>
      <Button
        style={styles.button}
        uppercase={true}
        mode="contained"
        onPress={() => {navigation.navigate('carWash'); setVisible(false)} }// Navigate to SignupScreen
      >
        Start
      </Button>
      <View style={styles.topHalf}>
        <ImageBackground source={require('./Orange Car.png')} style={styles.backgroundImage}>
          <View style={styles.overlay}></View>
        </ImageBackground>
      </View>
      <View style={styles.bottomHalf}>
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>About</Text>
        </View>
        <Text style={styles.aboutText}>
          Your description about the application goes here. You can provide details about its features, benefits, and how it works.
        </Text>
        {/* <Button
          style={styles.signUpButton}
          uppercase={true}
          mode="contained"
          onPress={() => navigation.navigate('signup')} // Navigate to SignupScreen
        >
          Sign Up
        </Button> */}
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // borderColor: 'black',
   // borderWidth: 1,
    backgroundColor: 'white',
  },
  topHalf: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  bottomHalf: {
    flex: 0.65,
    borderTopWidth: 1,
    borderTopColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: 'white',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'flex-end',
  },
  overlay: {},
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 50,
    paddingLeft: 10,
  },
  subTitle: {
    fontSize: 20,
    color: 'black',
    paddingLeft: 10,
    letterSpacing: 4,
  },
  aboutContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    marginHorizontal: 10,
    marginTop: 20,
  },
  clickedButton: {
    backgroundColor: 'red',
  },
  signUpButton: {
    marginVertical: 20,
    alignSelf: 'center',
  },
});

export default HomeScreen;
