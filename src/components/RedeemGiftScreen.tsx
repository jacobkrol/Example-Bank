import Gift from "../images/gift";
import { Text } from "../styles/styled";

export default function RedeemGiftScreen({
  count,
  setOpened
}: {
  count: number;
  setOpened: Function;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <Text as="p" fontSize="1.5rem">
        You unlocked {count} example{count > 1 && "s"}!
      </Text>
      <Gift onClick={() => setOpened(true)} />
      <Text
        as="p"
        fontSize="1.25rem"
        onClick={() => setOpened(true)}
        className="pointer"
      >
        Click to open
      </Text>
    </div>
  );
}
