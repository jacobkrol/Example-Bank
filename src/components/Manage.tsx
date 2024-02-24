import { QueryDocumentSnapshot } from "firebase/firestore";
import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCodes } from "../hooks/firebase";
import { BrowseContainer, SpinnerArea, Text } from "../styles/styled";
import { RedeemCode } from "../types";
import CodeCard from "./CodeCard";
import {
  WiredButton,
  WiredDialog,
  WiredSpinner,
  WiredToggle
} from "./WiredElements";

export default function Manage({ uid }: { uid: string }): JSX.Element {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hideUsed, setHideUsed] = useState<boolean>(true);
  const [hideExpired, setHideExpired] = useState<boolean>(true);
  const [dialogText, setDialogText] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [codes, setCodes] = useState<RedeemCode[]>([]);
  const navigate = useNavigate();

  const isLoggedIn = !!uid.length;

  const loadCodes = useCallback(async () => {
    setIsLoading(true);
    let data: RedeemCode[] = [];
    try {
      const docs: QueryDocumentSnapshot<RedeemCode>[] = await getCodes(
        hideUsed,
        hideExpired
      );
      if (!docs) throw new Error("Error querying redeem codes");
      data = docs.map((doc) => doc.data());
      // append new codes, removing duplicates from double API calls
      setCodes(data);
    } catch (err) {
      console.error(err);
      setDialogText(
        "An error occurred while attempting to find examples. " +
          "Please refresh your page, check your connection, and try again."
      );
      setDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [hideUsed, hideExpired]);

  useEffect(() => {
    loadCodes();
  }, [loadCodes]);

  const handleHideUsedToggle: ((e: Event) => unknown) &
    FormEventHandler<HTMLElement> = (evt) => {
    const toggle = evt.target as any;
    setHideUsed(toggle?.checked);
  };

  const handleHideExpiredToggle: ((e: Event) => unknown) &
    FormEventHandler<HTMLElement> = (evt) => {
    const toggle = evt.target as any;
    setHideExpired(toggle?.checked);
  };

  const removeCode: (codeId: string) => void = (codeId) => {
    setCodes((prev) => prev.filter((code) => code.id !== codeId));
  };

  useEffect(() => {
    if (!isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  return (
    <>
      <Text as="h2" fontSize="2.5rem">
        Manage Codes
      </Text>
      <WiredDialog open={dialogOpen}>
        <div className="dialog">
          <Text as="p" fontSize="1.25rem">
            {dialogText}
          </Text>
          <WiredButton onClick={() => setDialogOpen(false)}>Okay</WiredButton>
        </div>
      </WiredDialog>
      <BrowseContainer>
        <div
          style={{
            display: "flex",
            placeItems: "center",
            gap: "0.5rem",
            alignSelf: "flex-end"
          }}
        >
          <label htmlFor="manage-used-toggle">Hide Used Codes</label>
          <WiredToggle
            id="manage-used-toggle"
            checked={hideUsed}
            onChange={handleHideUsedToggle}
          />
        </div>
        <div
          style={{
            display: "flex",
            placeItems: "center",
            gap: "0.5rem",
            alignSelf: "flex-end"
          }}
        >
          <label htmlFor="manage-expired-toggle">Hide Expired Codes</label>
          <WiredToggle
            id="manage-expired-toggle"
            checked={hideExpired}
            onChange={handleHideExpiredToggle}
          />
        </div>
        {isLoading ? (
          <SpinnerArea>
            <Text fontSize="1.25rem">Loading redeem codes...</Text>
            <WiredSpinner spinning />
          </SpinnerArea>
        ) : !codes.length ? (
          <Text fontSize="1.25rem" className="center-x">
            No redeem codes found :/
          </Text>
        ) : (
          codes.map((code) => (
            <CodeCard key={code.id} code={code} removeCode={removeCode} />
          ))
        )}
      </BrowseContainer>
    </>
  );
}
