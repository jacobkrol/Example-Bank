import { Link, useNavigate } from "react-router-dom";
import { Text } from "../styles/styled";
import { WiredButton } from "./WiredElements";

export default function RedeemError() {
  const navigate = useNavigate();
  return (
    <>
      <Text as="p" fontSize="1.25rem">
        An error occurred while redeeming your code.
      </Text>
      <Text as="p" fontSize="1.25rem">
        Please try again later.
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
