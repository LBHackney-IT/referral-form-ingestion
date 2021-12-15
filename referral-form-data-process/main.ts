import { SQSEvent } from "aws-lambda";
import { addGoogleDocUrlToSheet } from "./lib/addGoogleDocUrlToSheet";
import { createDocumentFromTemplate } from "./lib/createGoogleDocFromTemplate";
import { generateAuth } from "./lib/generateGoogleAuth";
import { generateGoogleDocumentTitle } from "./lib/generateGoogleDocumentTitle";
import { getDataFromS3 } from "./lib/getDataFromS3";
import { sendDataToAPI } from "./lib/sendDataToAPI";

export const handler = async (sqsEvent: SQSEvent) => {
  const clientEmail = process.env.CLIENT_EMAIL as string;
  const privateKey = process.env.PRIVATE_KEY as string;
  const templateDocumentId = process.env.TEMPLATE_DOCUMENT_ID as string;
  const urlColumn = process.env.URL_COLUMN as string;
  const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");

  const formDataObjects = await getDataFromS3(sqsEvent);
  const googleAuthToken = await generateAuth(clientEmail, formattedPrivateKey);

  await Promise.all(
    formDataObjects.map(async (formData) => {
      const documentTitle = generateGoogleDocumentTitle(formData);
      const createdDocument = await createDocumentFromTemplate(
        googleAuthToken,
        templateDocumentId,
        documentTitle,
        formData
      );
      const documentUrl = `https://docs.google.com/document/d/${createdDocument.documentId}/edit`;
      await addGoogleDocUrlToSheet(
        googleAuthToken,
        documentUrl,
        urlColumn,
        formData.SubmissionRowPosition.toString()
      );

      await sendDataToAPI(formData, documentUrl);
    })
  );
};
