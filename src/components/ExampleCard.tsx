import { Text, Link } from "../styles/styled";
import { WiredCard } from "./WiredElements";
import Lightbulb from "../images/lightbulb";
import ImageNotSupported from "../images/noimage";

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
  source: "example.com",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ac lacus finibus, accumsan lorem sit amet, faucibus leo."
};

export default function ExampleCard({
  title,
  source,
  description,
  img
}: {
  title: string;
  source: string;
  description: string;
  img?: string;
}) {
  return (
    <WiredCard className="padding-1p5">
      <div className="example-card">
        <div className="example-card-text">
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
        <div className="img-wrapper" aria-hidden="true">
          {img === "none" ? (
            <ImageNotSupported alt="No image found for link" size={40} />
          ) : img ? (
            <img src={img} alt="Preview of link" />
          ) : (
            <Lightbulb alt="Preview of link"></Lightbulb>
          )}
        </div>
      </div>
    </WiredCard>
  );
}
