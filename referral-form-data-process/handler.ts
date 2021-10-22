import { SQSEvent } from "aws-lambda";
import { createDocumentFromTemplate } from "./lib/createGoogleDocFromTemplate";
import { generateAuth } from "./lib/generateGoogleAuth";
import { getDataFromS3 } from "./lib/getDataFromS3";
import { addGoogleDocUrlToSheet } from "./lib/addGoogleDocUrlToSheet";

export const main = async (sqsEvent: SQSEvent) => {
  const auth = await generateAuth(
    process.env.CLIENT_EMAIL as string,
    process.env.PRIVATE_KEY as string
  );

  const s3Data = await getDataFromS3(sqsEvent);

  const createdDocument = await createDocumentFromTemplate(
    auth,
    process.env.TEMPLATE_DOCUMENT_ID as string,
    `Test - ${new Date().toISOString()}`,
    s3Data as any
  );

  const documentUrl = `https://docs.google.com/spreadsheets/d/${createdDocument.documentId}/edit`;

  const urlColumn = process.env.URL_COLUMN as string;

  await addGoogleDocUrlToSheet(auth, documentUrl, urlColumn, "1");

  // call to API

  return "completed";
};
