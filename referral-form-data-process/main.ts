import { SQSEvent } from "aws-lambda";
import { generateAuth } from "./lib/generateGoogleAuth";
import { getDataFromS3 } from "./lib/getDataFromS3";

export const handler = async (sqsEvent: SQSEvent) => {
  const clientEmail = process.env.CLIENTEMAIL as string;
  const privateKey = process.env.PRIVATEKEY as string;

  const formDataObjects = await getDataFromS3(sqsEvent);

  const googleAuthToken = await generateAuth(clientEmail, privateKey);
};
