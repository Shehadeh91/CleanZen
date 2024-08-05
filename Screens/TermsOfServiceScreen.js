import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Title, Paragraph, useTheme } from 'react-native-paper';
import { SafeAreaProvider } from "react-native-safe-area-context";

const TermsOfServiceScreen = () => {

  const theme = useTheme();
  return (

      <View style={{ paddingTop: 75, backgroundColor: theme.colors.secondary, flex: 1 }}>
  <ScrollView contentContainerStyle={styles.container}>

     <Paragraph style={styles.paragraph}>
       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec lorem
       id orci maximus feugiat. Phasellus congue enim non urna commodo, vel
       fermentum nisi ultricies. Fusce vel ante nec felis vestibulum
       fringilla. Nullam cursus magna non sapien commodo, eget commodo libero
       ultricies. Integer consequat lacus a ligula consequat, ut mollis justo
       aliquam.
     </Paragraph>
     {/* Add more paragraphs as needed */}
   </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  paragraph: {
    marginBottom: 16,
    lineHeight: 24,
  },
});

export default TermsOfServiceScreen;
