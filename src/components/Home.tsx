import { Text, NavContainer, ButtonRow } from "../styles/styled";
import { Link } from "react-router-dom";
import { WiredButton } from "../components/WiredElements";
import "../styles/wiredstyles.css";
import Pencil from "../images/pencil-rough";
import Book from "../images/book-rough";
import ManageIcon from "../images/manage-rough";
import Gift from "../images/gift-rough";
import Profile from "../images/profile-rough";
// import { RoughSVG } from "react-rough-fiber";

export default function Home({ uid }: { uid: string }): JSX.Element {
  const isLoggedIn = !!uid.length;

  return (
    <>
      <Text as="h1" fontSize="2.5rem">
        Home
      </Text>
      <NavContainer>
        <Link
          to={isLoggedIn ? "/upload" : "/"}
          style={!isLoggedIn ? { cursor: "not-allowed" } : {}}
        >
          <WiredButton disabled={!isLoggedIn}>
            <ButtonRow>
              <Pencil size={20} />
              <span>Upload&nbsp;New</span>
            </ButtonRow>
          </WiredButton>
        </Link>
        <Link
          to={isLoggedIn ? "/browse" : "/"}
          style={!isLoggedIn ? { cursor: "not-allowed" } : {}}
        >
          <WiredButton disabled={!isLoggedIn}>
            <ButtonRow>
              <Book size={20} />
              <span>Browse&nbsp;Examples</span>
            </ButtonRow>
          </WiredButton>
        </Link>
        <Link
          to={isLoggedIn ? "/manage" : "/"}
          style={!isLoggedIn ? { cursor: "not-allowed" } : {}}
        >
          <WiredButton disabled={!isLoggedIn}>
            <ButtonRow>
              <ManageIcon size={20} />
              <span>Manage&nbsp;Codes</span>
            </ButtonRow>
          </WiredButton>
        </Link>
        <Link to="/redeem">
          <WiredButton>
            <ButtonRow>
              <Gift size={20} />
              <span>Redeem&nbsp;Code</span>
            </ButtonRow>
          </WiredButton>
        </Link>
        <Link
          to={isLoggedIn ? "/profile" : "/"}
          style={!isLoggedIn ? { cursor: "not-allowed" } : {}}
        >
          <WiredButton disabled={!isLoggedIn}>
            <ButtonRow>
              <Profile size={20} />
              <span>View&nbsp;Profile</span>
            </ButtonRow>
          </WiredButton>
        </Link>
      </NavContainer>
    </>
  );
}
