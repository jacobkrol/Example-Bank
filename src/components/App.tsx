import {
  useState,
  useEffect,
  FormEventHandler,
  ChangeEventHandler
} from "react";
import { ThemeProvider } from "styled-components";
import Header from "./Header";
import Footer from "./Footer";
import yellowTheme from "../styles/yellowTheme.json";
import {
  Text,
  AppContainer,
  BodyContainer,
  Form,
  NavContainer
} from "../styles/styled";
import { WiredButton } from "../components/WiredElements";
import "../styles/wiredstyles.css";
import { WiredInput } from "./WiredElements";
import { WiredTextarea } from "./WiredElements";
import { overwriteShadow } from "../hooks/overwriteShadow";
import { WiredDivider } from "./WiredElements";
import { WiredCard } from "./WiredElements";
import ExampleCard from "./ExampleCard";

const isValidUrl: (url: string) => Boolean = (url) => {
  try {
    const urlObj = new URL(encodeURI(url));
    return true;
  } catch {
    return false;
  } finally {
    return false;
  }
};

const initialUpload: { title: string; source: string; description: string } = {
  title: "",
  source: "",
  description: ""
};

function App() {
  const [page, setPage] = useState("home");
  const [uploadData, setUploadData] = useState(initialUpload);

  useEffect(() => {
    overwriteShadow(
      "wired-input",
      "input",
      (x) => (x.style.backgroundColor = yellowTheme.colors["60"])
    );
  }, [page]);

  const submitUpload = (evt: any) => {
    evt.preventDefault();

    // type check
  };

  const changeTitle: ((e: Event) => unknown) &
    FormEventHandler<HTMLInputElement> = (evt: any) => {
    const input = evt.currentTarget as HTMLInputElement;
    setUploadData((prev) => ({
      ...prev,
      title: input.value ?? ""
    }));
  };
  const changeSource: ((e: Event) => unknown) &
    FormEventHandler<HTMLInputElement> = (evt: any) => {
    const input = evt.currentTarget as HTMLInputElement;
    setUploadData((prev) => ({ ...prev, source: input.value ?? "" }));
  };
  const changeDescription: ((e: Event) => unknown) &
    FormEventHandler<HTMLInputElement> = (evt: any) => {
    const textarea = evt.currentTarget as HTMLTextAreaElement;
    setUploadData((prev) => ({ ...prev, description: textarea.value ?? "" }));
  };

  const Home = (
    <>
      <Text as="h1" fontSize="2.5rem">
        Home
      </Text>
      <NavContainer>
        <WiredButton onClick={() => setPage("upload")}>Upload</WiredButton>
        <WiredButton onClick={() => setPage("browse")}>Browse</WiredButton>
        <WiredButton elevation={2} onClick={() => setPage("redeem")}>
          Redeem
        </WiredButton>
      </NavContainer>
    </>
  );

  const Upload = (
    <>
      <Text as="h2" fontSize="2.5rem">
        Add Example
      </Text>
      <Form>
        <div>
          <label htmlFor="title">Example Title:</label>
          <WiredInput
            id="title"
            name="title"
            type="text"
            className="width-100"
            value={uploadData.title}
            onChange={changeTitle}
          />
        </div>
        <div>
          <label htmlFor="source">Source Link:</label>
          <WiredInput
            id="source"
            name="source"
            type="url"
            className="width-100"
            value={uploadData.source}
            onChange={changeSource}
          />
        </div>
        <div>
          <label htmlFor="description">Quick Description:</label>
          <WiredTextarea
            id="description"
            rows={4}
            value={uploadData.description}
            onChange={changeDescription}
          />
        </div>
        <WiredDivider className="center-block margin-top-1 margin-bottom-1" />
        <Text as="h2" fontSize="2.5rem">
          Preview
        </Text>
        <ExampleCard
          title={uploadData.title}
          source={uploadData.source}
          description={uploadData.description}
        />
        <WiredDivider className="center-block margin-top-1 margin-bottom-1" />
        <div>
          <WiredButton>Cancel</WiredButton>
          <WiredButton
            className="primary-button float-right"
            onClick={submitUpload}
          >
            Upload
          </WiredButton>
        </div>
      </Form>
    </>
  );

  return (
    <ThemeProvider theme={yellowTheme}>
      <AppContainer>
        <Header />
        <BodyContainer>
          {page === "home" ? (
            Home
          ) : page === "upload" ? (
            Upload
          ) : (
            <span>404</span>
          )}
        </BodyContainer>
        <Footer />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;

