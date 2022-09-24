import { Link, useNavigate } from "react-router-dom";
import { Text } from "../styles/styled";
import { WiredButton } from "./WiredElements";
import "../styles/wiredstyles.css";

export default function Error() {
  let navigate = useNavigate();

  return (
    <>
      <Text as="h2" fontSize="2.5rem">
        Error 404 :/
      </Text>
      <Text as="p" fontSize="1.5rem">
        The page you are navigating to could not be found.
      </Text>
      <Text as="p" fontSize="1.5rem">
        Please navigate back to the previous page or the home page.
      </Text>
      <div>
        <WiredButton onClick={() => navigate(-1)}>Go Back</WiredButton>
        <Link to="/" className="float-right">
          <WiredButton className="primary-button">Go Home</WiredButton>
        </Link>
      </div>
    </>
  );
}
