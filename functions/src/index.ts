import * as functions from "firebase-functions";
import { log } from "firebase-functions/logger";
import * as sgMail from "@sendgrid/mail";
import { defineString } from "firebase-functions/params";

// Define the expected structure of the request body
interface EmailRequestBody {
  name: string;
  email: string;
  purpose: string;
  subject: string;
  message: string;
}

// Validate and sanitize input fields
function validateAndSanitize(
  data: Partial<EmailRequestBody>
): EmailRequestBody {
  const { name, email, purpose, subject, message } = data;

  if (!name || !email || !purpose || !subject || !message) {
    log(`Found values: ${JSON.stringify(data)}`);
    throw new Error("All fields are required.");
  }

  const sanitizedData: EmailRequestBody = {
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    purpose: String(purpose).trim(),
    subject: String(subject).trim(),
    message: String(message).trim()
  };

  return sanitizedData;
}

export const sendEmail = functions.https.onRequest(
  { cors: [/example\-book\.kroljs\.com/, /localhost/] },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send({ success: false, message: "Method Not Allowed" });
      return;
    }

    try {
      const validatedData = validateAndSanitize(
        req.body as Partial<EmailRequestBody>
      );
      const { name, email, purpose, subject, message } = validatedData;

      const apiKey = defineString("SENDGRID_API_KEY").value();
      sgMail.setApiKey(apiKey);

      const msg = {
        to: "contact@kroljs.com",
        from: "contact@kroljs.com",
        subject: `[Example Book Contact Form] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nPurpose: ${purpose}\n\nMessage:\n${message}`
      };

      await sgMail.send(msg, false, (error, [result, _]) => {
        if (error) {
          res.status(500).send({
            success: false,
            message: `Failed to send email: ${JSON.stringify(error)}`
          });
        }

        if (!result) {
          res.status(500).send({
            success: false,
            message: "Opaque error occurred while sending email"
          });
        }

        res
          .status(200)
          .send({ success: true, message: "Email sent successfully!" });
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).send({ success: false, message: error.message });
    }
  }
);

