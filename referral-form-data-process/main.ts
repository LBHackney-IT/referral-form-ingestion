import { SQSEvent } from "aws-lambda";
import { createDocumentFromTemplate } from "./lib/createGoogleDocFromTemplate";
import { generateAuth } from "./lib/generateGoogleAuth";
import { getDataFromS3 } from "./lib/getDataFromS3";

export const handler = async (sqsEvent: SQSEvent) => {
  const clientEmail = process.env.CLIENTEMAIL as string;
  const privateKey = process.env.PRIVATEKEY as string;
  const templateDocumentId = process.env.TEMPLATEDOCUMENTID as string;
  const title = process.env.TITLE as string;
  const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");

  const formDataObjects = await getDataFromS3(sqsEvent);
  const googleAuthToken = await generateAuth(clientEmail, formattedPrivateKey);

  await Promise.all(
    formDataObjects.map(async (formData) => {
      await new Promise((resolve) => {
        resolve(
          createDocumentFromTemplate(
            googleAuthToken,
            templateDocumentId,
            title,
            formData
          )
        );
      });
    })
  );
};
