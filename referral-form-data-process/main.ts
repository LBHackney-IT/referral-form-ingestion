import { SQSEvent } from "aws-lambda";
import { createDocumentFromTemplate } from "./lib/createGoogleDocFromTemplate";
import { generateAuth } from "./lib/generateGoogleAuth";
import { getDataFromS3 } from "./lib/getDataFromS3";

export const handler = async (sqsEvent: SQSEvent) => {
  const clientEmail = process.env.CLIENTEMAIL as string;
  const privateKey = process.env.PRIVATEKEY as string;
  const templateDocumentId = process.env.TEMPLATEDOCUMENTID as string;
  const title = process.env.TITLE as string;

  const formDataObjects = await getDataFromS3(sqsEvent);

  const googleAuthToken = await generateAuth(clientEmail, privateKey);

  formDataObjects.forEach(
    async (formData) =>
      await createDocumentFromTemplate(
        googleAuthToken,
        templateDocumentId,
        title,
        formData
      )
  );
};
