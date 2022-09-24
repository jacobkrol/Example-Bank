import { FormEventHandler, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { overwriteShadow } from "../hooks/overwriteShadow";
import yellowTheme from "../styles/yellowTheme.json";
import { Text } from "../styles/styled";
import { WiredButton, WiredDivider, WiredInput } from "./WiredElements";

export default function Redeem() {
  const codeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    overwriteShadow(
      "wired-input",
      "input",
      (x) => (x.style.backgroundColor = yellowTheme.colors["60"])
    );
  }, []);

  const submitRedeem: FormEventHandler<HTMLElement> = (evt) => {
    evt.preventDefault();
    const code = codeRef.current as any;
    navigate(`/redeem/${code.value}`);
  };

  return (
    <>
      <Text as="h2" fontSize="2.5rem">
        Redeem a Code
      </Text>
      <label htmlFor="redeem-code">Enter your Code:</label>
      <WiredInput
        id="redeem-code"
        name="redeem-code"
        type="text"
        className="width-100"
        ref={codeRef}
      />
      <WiredDivider className="center-block margin-top-1 margin-bottom-1" />
      <div>
        <Link to="/">
          <WiredButton>Cancel</WiredButton>
        </Link>
        <WiredButton
          className="primary-button float-right"
          onClick={submitRedeem}
          itemType="submit"
          id="submit-redeem"
        >
          Redeem
        </WiredButton>
      </div>
    </>
  );
}
