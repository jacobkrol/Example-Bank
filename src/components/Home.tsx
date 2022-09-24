import { Text, NavContainer } from "../styles/styled";
import { Link } from "react-router-dom";
import { WiredButton } from "../components/WiredElements";
import "../styles/wiredstyles.css";

export default function Home({
  isAdmin,
  isContributor
}: {
  isAdmin: boolean;
  isContributor: boolean;
}): JSX.Element {
  return (
    <>
      <Text as="h1" fontSize="2.5rem">
        Home
      </Text>
      <NavContainer>
        <Link
          to={isContributor ? "/upload" : "/"}
          style={!isContributor ? { cursor: "not-allowed" } : {}}
        >
          <WiredButton disabled={!isContributor}>Upload&nbsp;New</WiredButton>
        </Link>
        <Link
          to={isAdmin ? "/browse" : "/"}
          style={!isAdmin ? { cursor: "not-allowed" } : {}}
        >
          <WiredButton disabled={!isAdmin}>Browse&nbsp;Examples</WiredButton>
        </Link>
        <Link
          to={isAdmin ? "/manage" : "/"}
          style={!isAdmin ? { cursor: "not-allowed" } : {}}
        >
          <WiredButton disabled={!isAdmin}>Manage&nbsp;Codes</WiredButton>
        </Link>
        <Link to="/redeem">
          <WiredButton>Redeem&nbsp;Code</WiredButton>
        </Link>
      </NavContainer>
    </>
  );
}
