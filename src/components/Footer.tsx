import React from "react";
// import styled from 'styled-components';
import { CenteredRow, Text, Link, FooterContainer } from "../styles/styled";

export default function Footer(): JSX.Element {
  return (
    <FooterContainer>
      <CenteredRow>
        <Link href="https://kroljs.com" rel="noopener noreferrer">
          Jacob Krol
        </Link>
        <Text>&nbsp;&copy;&nbsp;{new Date().getFullYear()}</Text>
      </CenteredRow>
    </FooterContainer>
  );
}
