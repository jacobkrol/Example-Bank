import { Text, Link } from "../styles/styled";
import { WiredCard } from "./WiredElements";
import Lightbulb from "../images/lightbulb";

const nbsp = "\xa0";

const getDomainFromUrl: (url: string) => string = (url) => {
  try {
    const urlObj = new URL(encodeURI(url));
    return urlObj.hostname;
  } catch {
    return "";
  }
};

const blankState = {
  title: "Example Title",
  source: "https://example.com",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac lacus finibus, accumsan lorem sit amet, faucibus leo."
};

// "https://kroljs.com/static/media/jk-brackets-64.2c84df93.png"

export default function ExampleCard({
  title,
  source,
  description
}: {
  title: string;
  source: string;
  description: string;
}) {
  return (
    <WiredCard className="padding-1p5">
      <div className="example-card">
        <div>
          <Text as="h3" fontSize="1.5rem">
            {title || blankState.title}
          </Text>
          <Link href={source} rel="noopener noreferrer">
            {getDomainFromUrl(source) || blankState.source}
          </Link>
          <Text as="p" fontSize="1rem">
            {description || blankState.description}
          </Text>
        </div>
        <Lightbulb alt="Preview of link"></Lightbulb>
      </div>
    </WiredCard>
  );
}
