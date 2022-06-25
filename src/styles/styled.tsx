import styled from "styled-components";
import yellowTheme from "../styles/yellowTheme.json";

export const CenteredRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
interface TextProps {
  fontSize?: string | number;
}
export const Text = styled.p<TextProps>`
  margin: 0;
  font-size: ${(props: TextProps) =>
    typeof props.fontSize === "number"
      ? `${props.fontSize}px`
      : typeof props.fontSize === "string"
      ? props.fontSize
      : "1rem"};
`;
export const Link = styled.a`
  margin: 0;
  font-size: 1rem;
  color: inherit;
`;

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${yellowTheme.colors["60"]};
`;
export const BodyContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: 0 auto;
  gap: 1.25rem;
  width: clamp(50%, 10rem, 95vw);
`;
export const NavContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 0;
  gap: 1.5rem;
`;
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const FooterContainer = styled.footer`
  margin-top: auto;
  margin-bottom: 1rem;
`;
