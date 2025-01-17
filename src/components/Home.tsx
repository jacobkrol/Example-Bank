import { Text } from "../styles/styled";
import "../styles/wiredstyles.css";

export default function Home({ uid }: { uid: string }): JSX.Element {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          marginTop: "2rem"
        }}
      >
        <Text as="h1" fontSize="2.5rem">
          Hello!
        </Text>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <Text fontSize="1.4rem">Example Book has moved 🚚</Text>
          <Text fontSize="1.4rem">
            Come visit us over at{" "}
            <a
              href="https://example-book.kroljs.com"
              target="_self"
              rel="noopener noreferrer"
            >
              example-book.kroljs.com
            </a>
          </Text>
          <Text fontSize="1.1rem" style={{ textAlign: "center" }}>
            A major browser update in June 2024 has added user security features
            but also disabled our login flow here, unfortunately. Join the party
            over on the new site! Sorry for the inconvenience.
          </Text>
        </div>
      </div>
    </>
  );
}
