import { useState, FormEventHandler, useEffect, useCallback } from "react";
import { Text, Form } from "../styles/styled";
import { Link, useLocation } from "react-router-dom";
import { WiredButton, WiredDialog } from "../components/WiredElements";
import yellowTheme from "../styles/yellowTheme.json";
import "../styles/wiredstyles.css";
import { WiredInput } from "./WiredElements";
import { WiredTextarea } from "./WiredElements";
import { WiredDivider } from "./WiredElements";
import ExampleCard from "./ExampleCard";
import { overwriteShadow } from "../hooks/overwriteShadow";
import useDebounce from "../hooks/useDebounce";
import { addExample } from "../hooks/firebase";
import { Example } from "../types";
import { fetchImage } from "../hooks/fetchImage";

const getDomainFromUrl: (url: string) => string = (url) => {
  try {
    const urlObj = new URL(encodeURI(url));
    return urlObj.hostname;
  } catch {
    return "";
  }
};

const initialUpload: Example = {
  id: "",
  title: "",
  source: "",
  description: "",
  img: ""
};

export default function Upload({ uid }: { uid: string }): JSX.Element {
  const [uploadData, setUploadData] = useState(initialUpload);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogText, setDialogText] = useState<string>("");
  const dbSource = useDebounce(uploadData.source, 500);
  const location = useLocation();

  const isLoggedIn = !!uid.length;

  const rememberDataLocally = () => {
    window.sessionStorage.setItem("draftupload", JSON.stringify(uploadData));
  };

  const recallDataLocally = useCallback(() => {
    const draft: string | null = window.sessionStorage.getItem("draftupload");
    if (!draft) return;
    try {
      const parsed: any = JSON.parse(draft);
      const exData: Example = castToExample(parsed);
      if (
        !exData.title.length &&
        !exData.description.length &&
        !exData.source.length &&
        !exData.img?.length
      ) {
        console.log("Invalid cached object found. Discarding.");
        forgetDataLocally();
        return;
      }

      setUploadData((prev: Example) => ({
        id: exData?.id || initialUpload.id,
        title: exData?.title || initialUpload.title,
        description: exData?.description || initialUpload.description,
        source: exData?.source || initialUpload.source,
        img: exData?.img || initialUpload.img
      }));
      setInputText({
        id: exData?.id || initialUpload.id,
        title: exData?.title || initialUpload.title,
        description: exData?.description || initialUpload.description,
        source: exData?.source || initialUpload.source,
        img: exData?.img || initialUpload.img
      });
      return;
    } catch (err) {
      console.log(`error occurred while reading from cache: ${err}`);
    }
  }, []);

  const forgetDataLocally = () => {
    window.sessionStorage.removeItem("draftupload");
  };

  useEffect(() => {
    const shareData: any = location.state;
    if (shareData?.title || shareData?.text || shareData?.url) {
      setUploadData((prev) => ({
        ...prev,
        title: shareData.title,
        description: shareData.text,
        source: shareData.url
      }));
      setInputText({
        ...initialUpload,
        title: shareData.title,
        description: shareData.text,
        source: shareData.url
      });
    } else {
      recallDataLocally();
      if (isLoggedIn) {
        forgetDataLocally();
      }
    }
  }, [location.state, recallDataLocally, isLoggedIn]);

  const setInputText = (state: Example) => {
    overwriteShadow("wired-input", "input", (x) => {
      if (x.name === "title") x.value = state?.title;
    });

    overwriteShadow("wired-input", "input", (x) => {
      if (x.name === "source") x.value = state?.source;
    });

    overwriteShadow("wired-textarea", "textarea", (x) => {
      if (x.id === "textarea") x.value = state?.description;
    });
  };

  useEffect(() => {
    // match input bg color to theme
    overwriteShadow(
      "wired-input",
      "input",
      (x) => (x.style.backgroundColor = yellowTheme.colors["60"])
    );
  }, []);

  useEffect(() => {
    // update preview image
    if (!getDomainFromUrl(dbSource)) return;
    fetchImage(dbSource).then((img) => {
      let imgStr = img;
      if (!img) imgStr = "none";
      setUploadData((prev) => ({ ...prev, img: imgStr }));
    });
  }, [dbSource]);

  const castToExample: (obj: any) => Example = (obj) => ({
    id: obj?.id || "",
    title: obj?.title || "",
    description: obj?.description || "",
    source: obj?.source || "",
    img: obj?.img || ""
  });

  const submitUpload: FormEventHandler<Element> = (evt) => {
    evt.preventDefault();

    // check user is logged in
    if (!isLoggedIn) {
      rememberDataLocally();
      setDialogText("You must sign in to upload examples.");
      setDialogOpen(true);
      return;
    }

    // check for valid submission
    let msg = [];
    if (!uploadData.title.length) msg.push("Example Title");
    if (!uploadData.description.length) msg.push("Quick Description");
    if (!getDomainFromUrl(uploadData.source)) msg.push("Source Link");
    if (msg.length) {
      alert(
        "Valid values are neccesary in the following fields to submit:\n\n\u2022 " +
          msg.join("\n\u2022 ")
      );
      return;
    }

    // submit to db
    const errMessage =
      "A problem occurred submitting your example. Please try again later.";
    addExample(uploadData)
      .then((docRef) => {
        if (docRef) {
          setDialogText("Submitted successfully!");
          setDialogOpen(true);
          setUploadData(initialUpload);
          setInputText(initialUpload);
          forgetDataLocally();
        } else {
          alert(errMessage);
        }
      })
      .catch((err) => {
        console.error(err);
        alert(errMessage);
      });
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
        Add Example
      </Text>
      <Form onSubmit={submitUpload}>
        <div>
          <label htmlFor="title">Example Title:</label>
          <WiredInput
            id="title"
            name="title"
            type="text"
            className="width-100"
            value={uploadData.title}
            onChange={changeTitle}
            required
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
            required
          />
        </div>
        <div>
          <label htmlFor="description">Quick Description:</label>
          <WiredTextarea
            id="description"
            className="width-100"
            rows={4}
            value={uploadData.description}
            onChange={changeDescription}
            required
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
          img={uploadData.img}
        />
        <WiredDivider className="center-block margin-top-1 margin-bottom-1" />
        <div>
          <Link to="/">
            <WiredButton>Cancel</WiredButton>
          </Link>
          <WiredButton
            className="primary-button float-right"
            onClick={submitUpload}
            itemType="submit"
            id="submit-upload"
            disabled={!isLoggedIn}
          >
            Upload
          </WiredButton>
        </div>
      </Form>
    </>
  );
}
