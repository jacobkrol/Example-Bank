import { Link, ListItem, Text, UnorderedList } from "../styles/styled";

const contactEmail = "contact@kroljs.com";

export default function PrivacyPolicy(): JSX.Element {
  return (
    <>
      <Text as="h2" fontSize="2.5rem">
        Privacy Policy
      </Text>
      <Text>Last updated: November 05, 2024</Text>
      <Text>
        Welcome to <strong>Example Book</strong>. This privacy policy explains
        how we collect, use, and share your personal information when you use
        our website.
      </Text>
      <Text as="h3" fontSize="1.5rem">
        1. What Information We Collect
      </Text>
      <UnorderedList>
        <ListItem>
          <strong>Personal Information</strong>: Such as your name and email if
          you contact us or sign up for an account.
        </ListItem>
        <ListItem>
          <strong>Usage Information</strong>: Such as your IP address, browser
          type, and browsing actions on our site.
        </ListItem>
      </UnorderedList>
      <Text as="h3" fontSize="1.5rem">
        2. How We Use the Information
      </Text>
      <Text>We use this information to:</Text>
      <UnorderedList>
        <ListItem>Respond to any inquiries you send us</ListItem>
        <ListItem>Improve our website and its user experience</ListItem>
      </UnorderedList>
      <Text as="h3" fontSize="1.5rem">
        3. How We Share the Information
      </Text>
      <Text>
        We do not sell or share your personal information with third parties,
        except as necessary to comply with legal obligations or improve our
        website&apos;s functionality.
      </Text>
      <Text as="h3" fontSize="1.5rem">
        4. Your Rights
      </Text>
      <Text>
        If you would like to review, update, or delete any personal information
        you&apos;ve provided, please contact us at{" "}
        <Link href={`mailto:${contactEmail}`} rel="noopener noreferrer">
          {contactEmail}
        </Link>
        .
      </Text>
      <Text as="h3" fontSize="1.5rem">
        5. Updates to This Policy
      </Text>
      <Text>
        We may update this privacy policy from time to time. We encourage you to
        review it periodically for any changes.
      </Text>
      <Text as="h3" fontSize="1.5rem">
        6. Contact Us
      </Text>
      <Text>
        For questions about this privacy policy, please contact us at{" "}
        <Link href={`mailto:${contactEmail}`} rel="noopener noreferrer">
          {contactEmail}
        </Link>
        .
      </Text>
    </>
  );
}
