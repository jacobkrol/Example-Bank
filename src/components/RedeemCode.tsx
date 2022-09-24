import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCodeExamples, getCodeExpiration } from "../hooks/firebase";
import { Text, SpinnerArea } from "../styles/styled";
import { Example } from "../types";
import ExampleCard from "./ExampleCard";
import RedeemError from "./RedeemError";
import RedeemGiftScreen from "./RedeemGiftScreen";
import { WiredSpinner } from "./WiredElements";

export default function RedeemCode() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [examples, setExamples] = useState<Example[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);
  const [expirationDate, setExpirationDate] = useState<string>("");
  const params = useParams();

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
  }, [params.code]);

  return (
    <>
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
            This code will expire on {expirationDate || "..."}.
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
        </>
      )}
    </>
  );
}
