import { QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import {
  deleteCode,
  expirationWindow,
  getCodeExamples
} from "../hooks/firebase";
import CalendarNo from "../images/calendarno";
import CalendarYes from "../images/calendaryes";
import Envelope from "../images/envelope";
import EnvelopeOpen from "../images/envelopeopen";
import { Text } from "../styles/styled";
import { Example, RedeemCode } from "../types";
import { WiredButton, WiredCard, WiredDialog } from "./WiredElements";

export default function CodeCard({
  code,
  removeCode
}: {
  code: RedeemCode;
  removeCode: Function;
}): JSX.Element {
  const [exampleTitles, setExampleTitles] = useState<string[]>([]);
  const [dialogText, setDialogText] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const isExpired = useMemo(() => {
    const ans =
      (code.meta?.created.seconds ?? 0) * 1000 + expirationWindow <
      new Date().valueOf();
    return ans;
  }, [code.meta?.created]);

  useEffect(() => {
    async function getExampleNames() {
      const exampleDocs: QueryDocumentSnapshot<Example>[] | false =
        await getCodeExamples(code.code, true);
      if (!exampleDocs) return;
      setExampleTitles(exampleDocs.map((doc) => doc.get("title")));
    }

    getExampleNames();
  }, [code.exampleIds, code.code]);

  const deleteCodeClick: (codeId: string) => Promise<void> = async (codeId) => {
    if (
      window.confirm(
        `Are you sure you would like to delete the following code?\n\n${code.code}\n\nThis action cannot be undone.`
      )
    ) {
      try {
        await deleteCode(codeId);
        setDialogText("Successfully deleted!");
        setDialogOpen(true);
      } catch (err) {
        console.error(err);
        setDialogText(
          "An error occurred while deleting the selected code. " +
            "Please refresh the page, check your connection, and try again."
        );
        setDialogOpen(true);
      }
    }
  };

  return (
    <>
      <WiredDialog open={dialogOpen}>
        <div className="dialog">
          <Text as="p" fontSize="1.25rem">
            {dialogText}
          </Text>
          <WiredButton onClick={() => removeCode(code.id)}>Okay</WiredButton>
        </div>
      </WiredDialog>
      <WiredCard className="width-100 padding-1p5">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap"
          }}
        >
          <strong>
            <Text fontSize="1.5rem">{code.code}</Text>
          </strong>
          <Text>
            {`Created on ${new Date((code.meta?.created.seconds ?? 0) * 1000)
              .toDateString()
              .substring(4)}`}
          </Text>
        </div>
        <ul>
          {exampleTitles.map((title) => (
            <Text as="li" fontSize="1.25rem" key={title}>
              {title}
            </Text>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {code.used ? (
            <EnvelopeOpen size={15} alt="opened code" />
          ) : (
            <Envelope size={15} alt="unopened code" />
          )}
          <Text>{code.used ? "Used" : "Unused"}</Text>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {isExpired ? (
            <CalendarNo size={15} alt="opened code" />
          ) : (
            <CalendarYes size={15} alt="unopened code" />
          )}
          <Text>{`${isExpired ? "" : "Not "}Expired`}</Text>
        </div>
        <WiredButton
          className="primary-button float-right"
          onClick={() => deleteCodeClick(code.id)}
        >
          Delete
        </WiredButton>
      </WiredCard>
    </>
  );
}
