import { Link } from "react-router-dom";
import styled from "styled-components";
import { Text } from "../styles/styled";
import { auth, signOutUser } from "../hooks/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithRedirect
} from "firebase/auth";
import Logo from "../images/logo-146.png";

const HeaderContainer = styled.div`
  display: inline-block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: ${(props) => props.theme.colors["30"]};
  color: ${(props) => props.theme.colors["60"]};
  padding: 1rem 2rem;
  box-shadow: ${(props) => `0px 0px 12px 0px ${props.theme.colors["30"]}`};
  z-index: 99;
`;
const LeftGroup = styled.div`
  float: left;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RightGroup = styled.div`
  float: right;
  display: flex;
  place-items: center;
`;

export default function Header(): JSX.Element {
  const [user] = useAuthState(auth);

  const signIn = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, googleProvider);
      console.log(await getRedirectResult(auth));
    } catch (err: any) {
      if (!err.message.match("auth/popup-closed-by-user")) {
        alert(
          "An error occurred signing you in. " +
            "Please refresh the page, check your connection, and try again."
        );
      }
      console.error(err);
    }
  };

  const signOut = async () => {
    try {
      const res = await signOutUser();
      if (!res) {
        alert(
          "An error occurred while attempting to sign you out. " +
            "Please refresh the page, check your connection, and try again."
        );
      }
    } catch (err) {
      console.error(err);
      alert(
        "An error occurred while attempting to sign you out. " +
          "Please refresh the page, check your connection, and try again."
      );
    }
  };

  return (
    <HeaderContainer>
      <LeftGroup>
        <Link to="/" className="center-y">
          <img
            src={Logo}
            height="30px"
            style={{ borderRadius: "25%" }}
            alt="app logo"
          />
        </Link>
        <Link to="/" className="no-underline">
          <Text as="h1" fontSize="1.4rem">
            Example Book
          </Text>
        </Link>
      </LeftGroup>
      <RightGroup>
        <Text
          as="a"
          className="anchor"
          onClick={user ? signOut : signIn}
          fontSize="1.5rem"
        >
          {user ? "Sign Out" : "Sign In"}
        </Text>
      </RightGroup>
    </HeaderContainer>
  );
}
