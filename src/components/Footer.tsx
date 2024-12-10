import { CenteredRow, Text, Link, FooterContainer } from "../styles/styled";
import { Link as LinkDOM } from "react-router-dom";
import metadata from "../metadata.json";

export default function Footer(): JSX.Element {
  const SeparatorChar = ({ char }: { char?: string }) => (
    <span>&nbsp;{char ?? "\u2022"}&nbsp;</span>
  );

  return (
    <FooterContainer>
      <CenteredRow>
        <Link href="https://kroljs.com" rel="noopener noreferrer">
          Jacob Krol
        </Link>
        <SeparatorChar char="&copy;" />
        <Text>{new Date().getFullYear()}</Text>
        <SeparatorChar />
        <Text>
          v{metadata.buildMajor}.{metadata.buildMinor}.{metadata.buildRevision}
        </Text>
        <SeparatorChar />
        <LinkDOM to="/privacy">Privacy Policy</LinkDOM>
        <SeparatorChar />
        <LinkDOM to="/contact">Contact</LinkDOM>
      </CenteredRow>
    </FooterContainer>
  );
}
