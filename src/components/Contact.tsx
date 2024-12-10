import { FormEventHandler, useEffect, useState } from "react";
import { Form, Text } from "../styles/styled";
import { overwriteShadow } from "../hooks/overwriteShadow";
import yellowTheme from "../styles/yellowTheme.json";
import {
  WiredButton,
  WiredCombo,
  WiredDialog,
  WiredInput,
  WiredItem,
  WiredTextarea
} from "./WiredElements";
import "../styles/wiredstyles.css";
import { useNavigate } from "react-router-dom";

const CONTACT_API = process.env.REACT_APP_CONTACT_API || "";

export default function ContactUs(): JSX.Element {
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogText, setDialogText] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    overwriteShadow(
      "wired-input",
      "input",
      (el) => (el.style.backgroundColor = yellowTheme.colors["60"])
    );
  }, []);

  useEffect(() => {
    if (isSent && !dialogOpen) {
      navigate("/");
    }
  }, [isSent, dialogOpen, navigate]);

  const submitContact: FormEventHandler<Element> = (evt) => {
    setIsSending(true);
    evt.preventDefault();
    const requestBody = {
      name: document.getElementById("contact-name"),
      email: document.getElementById("contact-email"),
      purpose: document.getElementById("contact-purpose"),
      subject: document.getElementById("contact-subject"),
      message: document.getElementById("contact-message")
    };
    fetch(CONTACT_API, { method: "POST", body: JSON.stringify(requestBody) })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then((res) => {
        setIsSending(false);
        setIsSent(true);
        setDialogText(
          "Message sent successfully! Thanks for reaching out. We'll get back to you as soon as we can."
        );
        setDialogOpen(true);
      })
      .catch((err) => {
        console.error(err);
        setIsSending(false);
        setDialogText(
          "An error occurred sending your message. Please check the form is filled out fully and correctly, or try again later."
        );
        setDialogOpen(true);
      });
  };

  return (
    <>
      <WiredDialog open={dialogOpen}>
        <div className="dialog max-width-med">
          <Text as="p" fontSize="1.25rem">
            {dialogText}
          </Text>
          <WiredButton onClick={() => setDialogOpen(false)}>Okay</WiredButton>
        </div>
      </WiredDialog>

      <Text as="h2" fontSize="2.5rem">
        Contact Us
      </Text>
      <Form onSubmit={submitContact}>
        <div>
          <label htmlFor="name">Full Name:</label>
          <WiredInput
            id="contact-name"
            name="name"
            placeholder="John Jacob Jingleheimer Schmidt"
            className="width-100"
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <WiredInput
            id="contact-email"
            name="email"
            placeholder="John Jacob Jingleheimer Schmidt"
            className="width-100"
          />
        </div>
        <div style={{ paddingTop: "10px" }}>
          <WiredCombo id="contact-purpose" selected="default">
            <WiredItem value="default">-- Purpose --</WiredItem>
            <WiredItem value="bug">Report a bug</WiredItem>
            <WiredItem value="feature">Request a feature</WiredItem>
            <WiredItem value="account">Issue with my account</WiredItem>
            <WiredItem value="other">Something else...</WiredItem>
          </WiredCombo>
        </div>
        <div>
          <label htmlFor="subject">Subject:</label>
          <WiredInput
            id="contact-subject"
            name="subject"
            placeholder="Collab opportunity?"
            className="width-100"
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label>
          <WiredTextarea
            id="contact-message"
            className="width-100"
            rows={4}
            placeholder="We've been trying to reach you regarding your car's extended warranty..."
          />
        </div>
        <div>
          <div style={{ display: "content" }} className="float-right">
            <WiredButton
              className="primary-button"
              itemType="submit"
              onClick={submitContact}
            >
              {isSending ? "..." : "Submit"}
            </WiredButton>
          </div>
        </div>
      </Form>
    </>
  );
}
