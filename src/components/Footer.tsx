import { CenteredRow, Text, Link, FooterContainer } from "../styles/styled";
import metadata from "../metadata.json";

export default function Footer(): JSX.Element {
  return (
    <FooterContainer>
      <CenteredRow>
        <Link href="https://kroljs.com" rel="noopener noreferrer">
          Jacob Krol
        </Link>
        <Text>
          &nbsp;&copy;&nbsp;{new Date().getFullYear()}&nbsp;&#8226;&nbsp;
        </Text>
        <Text>
          v{metadata.buildMajor}.{metadata.buildMinor}.{metadata.buildRevision}
        </Text>
      </CenteredRow>
    </FooterContainer>
  );
}
