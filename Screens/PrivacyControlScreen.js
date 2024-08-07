import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Title, Paragraph, useTheme } from 'react-native-paper';
import { SafeAreaProvider } from "react-native-safe-area-context";


const PrivacyControlScreen = () => {

  const theme = useTheme();

  return (

      <View style={{ paddingTop: 75, backgroundColor: theme.colors.background, flex: 1  }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Privacy Policy</Title>
      <Paragraph style={styles.paragraph}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec
        lorem id orci maximus feugiat. Phasellus congue enim non urna commodo,
        vel fermentum nisi ultricies. Fusce vel ante nec felis vestibulum
        fringilla. Nullam cursus magna non sapien commodo, eget commodo libero
        ultricies. Integer consequat lacus a ligula consequat, ut mollis justo
        aliquam.
      </Paragraph>
      {/* Add more paragraphs for the privacy policy */}

      <Title style={styles.title}>Cookies and Analytics</Title>
      <Paragraph style={styles.paragraph}>
        Our application uses cookies to enhance user experience and analyze site
        traffic. By continuing to use this site, you consent to the use of
        cookies in accordance with our privacy policy.
      </Paragraph>
      {/* Add more content about cookies and analytics */}
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

export default PrivacyControlScreen;
