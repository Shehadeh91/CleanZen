import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Title, Paragraph, useTheme, Headline } from 'react-native-paper';
import { SafeAreaProvider } from "react-native-safe-area-context";

const TermsOfServiceScreen = () => {

  const theme = useTheme();
  return (

      <View style={{ paddingTop: 100, backgroundColor: theme.colors.background, flex: 1 }}>
  <ScrollView contentContainerStyle={styles.container}>



    <Paragraph style={styles.paragraph}>
      <Text style={styles.sectionTitle}>1. Introduction: </Text>
      Welcome to PureCare Tech Cleaning Services. By booking our services, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
    </Paragraph>

    <Paragraph style={styles.paragraph}>
      <Text style={styles.sectionTitle}>2. Services Provided: </Text>
      PureCare Tech offers professional cleaning services exclusively in Winnipeg, Manitoba. Our services include residential cleaning, commercial cleaning, car wash services, and specialized cleaning services. The scope of services, frequency, and specific requirements will be agreed upon between PureCare Tech and the client before the commencement of any work.
    </Paragraph>

    <Paragraph style={styles.paragraph}>
      <Text style={styles.sectionTitle}>3. Booking and Payment: </Text>
      <Text style={styles.subSectionTitle}>Booking: </Text>
      Clients can book services via our website, phone, or app. Bookings are subject to availability and confirmation.
      <Text style={styles.subSectionTitle}>Payment: </Text>
      Payment is required at the time of booking and is only accepted via credit or debit card.
      Full payment is processed before the service is performed.
      No services will be provided until payment has been successfully processed.
      <Text style={styles.subSectionTitle}>Pricing: </Text>
      Service rates vary based on the type and scope of the service. For residential cleaning, pricing depends on the number of hours required. For car wash services, pricing is based on factors such as car body style and interior or exterior cleaning requirements. Clients will be provided with a detailed quote before booking.
    </Paragraph>

    <Paragraph style={styles.paragraph}>
      <Text style={styles.sectionTitle}>4. Cancellation and Refunds </Text>
      <Text style={styles.subSectionTitle}>Cancellation: </Text>
      Clients may cancel their booking at any time before our agent arrives at the premises or vehicle. Cancellations made after the agent has arrived will not be eligible for a refund.
      <Text style={styles.subSectionTitle}>Refund Policy: </Text>
      If the service is not completed or not performed to the client's satisfaction, PureCare Tech will issue a full refund of the payment made.
      Refund requests must be made within 24 hours of the scheduled service time.
      Refunds will be processed back to the original payment method within 5-7 business days.
    </Paragraph>

    <Paragraph style={styles.paragraph}>
      <Text style={styles.sectionTitle}>5. Client Responsibilities </Text>
      <Text style={styles.subSectionTitle}>Access: </Text>
      Clients must ensure that our cleaning team has access to the premises or vehicle at the agreed time. Failure to provide access may result in service not being performed.
      <Text style={styles.subSectionTitle}>Environment: </Text>
      Clients are responsible for ensuring that the environment is safe for our cleaning team to work in. This includes removing any hazardous materials or ensuring pets are secured.
    </Paragraph>

    <Paragraph style={styles.paragraph}>
      <Text style={styles.sectionTitle}>6. Liability </Text>
      <Text style={styles.subSectionTitle}>Damage: </Text>
      PureCare Tech will take reasonable care while providing services. However, we are not liable for any damage to property or vehicles unless it is proven to be caused by the gross negligence or willful misconduct of our staff.
      <Text style={styles.subSectionTitle}>Insurance: </Text>
      We are fully insured. In the event of any accidental damage, clients must report it within 24 hours of service completion for us to consider a claim.
    </Paragraph>

    <Paragraph style={styles.paragraph}>
      <Text style={styles.sectionTitle}>7. Satisfaction Guarantee </Text>
      We strive for 100% client satisfaction. If you are not satisfied with our service, please contact us within 24 hours of the service. We will investigate and, if necessary, re-clean the affected areas at no additional cost.
    </Paragraph>

    <Paragraph style={styles.paragraph}>
      <Text style={styles.sectionTitle}>8. Privacy and Confidentiality </Text>
      <Text style={styles.subSectionTitle}>Privacy: </Text>
      We respect your privacy. Any personal information collected will be used solely for providing services and will not be shared with third parties without your consent.
      <Text style={styles.subSectionTitle}>Confidentiality: </Text>
      Our staff is trained to maintain the confidentiality of your personal and property information.
    </Paragraph>

    <Paragraph style={styles.paragraph}>
      <Text style={styles.sectionTitle}>9. Termination </Text>
      PureCare Tech reserves the right to terminate services at any time with immediate effect if a client breaches these terms, behaves inappropriately towards staff, or if circumstances arise that make it unsafe or impractical to continue providing services.
    </Paragraph>

    <Paragraph style={styles.paragraph}>
      <Text style={styles.sectionTitle}>10. Governing Law </Text>
      These terms and conditions are governed by and construed in accordance with the laws of the Province of Manitoba. Any disputes will be subject to the exclusive jurisdiction of the courts in Winnipeg, Manitoba.
    </Paragraph>

    <Paragraph style={styles.paragraph}>
      <Text style={styles.sectionTitle}>11. Amendments </Text>
      PureCare Tech reserves the right to update or amend these terms and conditions at any time. Clients will be notified of any changes, and continued use of our services will constitute acceptance of the updated terms.
    </Paragraph>
     {/* Add more paragraphs as needed */}
   </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paragraph: {
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
});

export default TermsOfServiceScreen;
