import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Title, Paragraph, useTheme } from 'react-native-paper';
import { SafeAreaProvider } from "react-native-safe-area-context";


const PrivacyControlScreen = () => {

  const theme = useTheme();

  return (

      <View style={{ paddingTop: 50, backgroundColor: theme.colors.background, flex: 1  }}>
    <ScrollView contentContainerStyle={styles.container}>
    <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>1. Privacy Commitment</Text>
        {"\n"}
        At PureCare Tech, we prioritize your privacy and are committed to protecting your personal information. This Privacy Control section outlines how we collect, use, and safeguard your data.
      </Paragraph>

      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>2. Information Collection</Text>
        {"\n"}
        We collect personal information you provide directly, such as your name, contact details, and service preferences when you book our services or interact with our app. We may also collect usage data and device information to improve our services and app performance.
      </Paragraph>

      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>3. Use of Information</Text>
        {"\n"}
        Your personal information is used to:
        {"\n"}- Provide and manage the services you request.
        {"\n"}- Process payments and handle customer support.
        {"\n"}- Send notifications and updates related to our services.
        {"\n"}- Improve and personalize your experience with our app.
      </Paragraph>

      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>4. Data Security</Text>
        {"\n"}
        We implement robust security measures to protect your data from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet or electronic storage is completely secure, so we cannot guarantee absolute security.
      </Paragraph>

      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>5. Third-Party Services</Text>
        {"\n"}
        We use third-party services to facilitate and enhance our app's functionality:
        {"\n"}- <Text style={styles.link} onPress={() => Linking.openURL('https://firebase.google.com/support/privacy')}>Firebase</Text>: We use Firebase for authentication, data storage, and analytics. Firebase's privacy practices can be reviewed at their privacy policy.
        {"\n"}- <Text style={styles.link} onPress={() => Linking.openURL('https://stripe.com/privacy')}>Stripe</Text>: We use Stripe to process payments. Stripe's privacy practices can be reviewed at their privacy policy.
      </Paragraph>

      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>6. Data Sharing</Text>
        {"\n"}
        We do not share your personal information with third parties except:
        {"\n"}- With service providers who assist us in operating our app and providing services (e.g., Firebase, Stripe).
        {"\n"}- When required by law or to protect our rights and safety.
      </Paragraph>

      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>7. Your Rights</Text>
        {"\n"}
        You have the right to:
        {"\n"}- Access and update your personal information.
        {"\n"}- Request deletion of your data, subject to applicable legal requirements.
        {"\n"}- Opt out of receiving marketing communications.
      </Paragraph>

      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>8. Cookies and Tracking Technologies</Text>
        {"\n"}
        We use cookies and similar technologies to enhance your experience, analyze app usage, and deliver personalized content. You can manage your cookie preferences through your device settings.
      </Paragraph>

      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>9. Changes to Privacy Control</Text>
        {"\n"}
        We may update this Privacy Control section periodically. Any changes will be posted on this page, and continued use of our app constitutes acceptance of the revised terms.
      </Paragraph>

      <Paragraph style={styles.paragraph}>
        <Text style={styles.sectionTitle}>10. Contact Us</Text>
        {"\n"}
        For any questions or concerns regarding our Privacy Control practices, please contact us at <Text style={styles.link} onPress={() => Linking.openURL('mailto:admin@purecaretech.com')}>admin@purecaretech.com</Text>.
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
