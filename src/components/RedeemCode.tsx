import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCodeExamples,
  getCodeExpiration,
  importExamples,
  isCodeImported,
  setCodeImported
} from "../hooks/firebase";
import { Text, SpinnerArea } from "../styles/styled";
import { Example } from "../types";
import ExampleCard from "./ExampleCard";
import RedeemError from "./RedeemError";
import RedeemGiftScreen from "./RedeemGiftScreen";
import { WiredButton, WiredDialog, WiredSpinner } from "./WiredElements";
import { useAuthorization } from "../hooks/useAuthorization";

export default function RedeemCode() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [examples, setExamples] = useState<Example[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);
  const [expirationDate, setExpirationDate] = useState<string>("");
  const { uid } = useAuthorization();
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isImported, setIsImported] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogText, setDialogText] = useState<string>("");
  const params = useParams();

  const isLoggedIn = useMemo(() => !!uid.length, [uid]);

  useEffect(() => {
    // start loading and guard for code error
    setIsLoading(true);
    if (!params.code) {
      setError(true);
      return;
    }

    // get code expiration date
    getCodeExpiration(params.code ?? "")
      .then((ms) => setExpirationDate(new Date(ms).toDateString().substring(4)))
      .catch((err) => {
        console.error(err);
        setError(true);
      });

    // pull code examples and reset loading status
    getCodeExamples(params.code)
      .then((docRef) => {
        if (!docRef) throw new Error("Failed to return example documents");
        const data = docRef.map((doc) => doc.data());
        setExamples(data);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      })
      .finally(() => setIsLoading(false));

    // check if previously imported
    setIsImported(true);
    isCodeImported(params.code)
      .then(setIsImported)
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsImporting(false));
  }, [params.code]);

  const startImport = async () => {
    // return early if not logged in
    if (!isLoggedIn) {
      setDialogText(
        "You must sign in to import these examples into your Example Book collection."
      );
      setDialogOpen(true);
      return;
    }

    // return early if already importing
    if (isImporting) {
      setDialogText("Import is in progress. Please wait another moment.");
      setDialogOpen(true);
      return;
    }

    // return early if already imported
    let dbSaysIsImported = false;
    try {
      dbSaysIsImported =
        isImported || (await isCodeImported(params.code ?? ""));
    } catch (err) {
      console.error(err);
    }
    if (dbSaysIsImported) {
      setIsImported(true);
      setDialogText(
        "These examples have already been imported into your collection."
      );
      setDialogOpen(true);
      return;
    }

    // begin import
    setIsImporting(true);
    try {
      // import examples
      await importExamples(examples);

      // mark as imported
      await setCodeImported(params.code ?? "", true);
      setIsImported(true);

      // inform user of success
      setDialogText("Examples were imported successfully!");
      setDialogOpen(true);
    } catch (err) {
      // handle error during import or setting code is used
      console.error(err);
      setDialogText(
        "An error occurred while importing the examples. Please try again later."
      );
      setDialogOpen(true);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <WiredDialog open={dialogOpen}>
        <div className="dialog">
          <Text as="p" fontSize="1.25rem">
            {dialogText}
          </Text>
          <WiredButton onClick={() => setDialogOpen(false)}>Okay</WiredButton>
        </div>
      </WiredDialog>
      <Text as="h2" fontSize="2.5rem">
        {examples.length && opened ? "Unlocked Examples" : "Redeem a Code"}
      </Text>
      {isLoading ? (
        <SpinnerArea>
          <Text fontSize="1.25rem">Processing redemption...</Text>
          <WiredSpinner spinning />
        </SpinnerArea>
      ) : !examples.length || error ? (
        <RedeemError />
      ) : !opened ? (
        <RedeemGiftScreen count={examples.length} setOpened={setOpened} />
      ) : (
        <>
          <Text as="p" fontSize="1.5rem">
            Take note!
          </Text>
          <Text as="p" fontSize="1.25rem">
            Be sure to copy these examples to your personal example bank soon.
            This code will expire{" "}
            {expirationDate ? `on ${expirationDate}` : "soon"}.
          </Text>
          {examples.map((ex: Example) => (
            <React.Fragment key={ex.id}>
              <ExampleCard
                title={ex.title}
                source={ex.source}
                description={ex.description}
                img={ex.img}
              />
            </React.Fragment>
          ))}
          <div>
            <WiredButton
              className="primary-button float-right"
              onClick={startImport}
              itemType="submit"
              id="submit-upload"
              disabled={!isLoggedIn || isImporting || isImported}
            >
              {isImporting ? (
                <WiredSpinner spinning className="button-spinner" />
              ) : isImported ? (
                <span>Imported</span>
              ) : (
                <span>Upload</span>
              )}
            </WiredButton>
          </div>
        </>
      )}
    </>
  );
}
