import { CenteredRow, Text, Link, FooterContainer } from "../styles/styled";

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
      </CenteredRow>
    </FooterContainer>
  );
}
