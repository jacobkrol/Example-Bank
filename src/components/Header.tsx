import React from "react";
import styled from "styled-components";
import Lightbulb from "../images/lightbulb";

const HeaderContainer = styled.div`
  display: inline-block;
  width: 100%;
  background-color: ${(props) => props.theme.colors["30"]};
  color: ${(props) => props.theme.colors["60"]};
  padding: 0.2rem 0.8rem;
  box-shadow: ${(props) => `0px 0px 12px 0px ${props.theme.colors["30"]}`};
`;
const LeftGroup = styled.div`
  float: left;
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const HeaderTitle = styled.h1`
  font-size: 1.4rem;
`;

export default function Header(): JSX.Element {
  return (
    <HeaderContainer>
      <LeftGroup>
        <Lightbulb size={25} />
        <HeaderTitle>App Name</HeaderTitle>
      </LeftGroup>
    </HeaderContainer>
  );
}
