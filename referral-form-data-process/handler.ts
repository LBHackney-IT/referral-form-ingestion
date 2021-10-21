import { SQSEvent } from "aws-lambda";
import { createDocumentFromTemplate } from "./lib/createGoogleDocFromTemplate";
import { generateAuth } from "./lib/generateGoogleAuth";
import { getDataFromS3 } from "./lib/getDataFromS3";

export const main = async (sqsEvent: SQSEvent) => {
  const auth = await generateAuth(
    process.env.CLIENTEMAIL as string,
    process.env.PRIVATEKEY as string
  );
  console.log("env is: " + process.env.CLIENTEMAIL);
  const s3Data = await getDataFromS3(sqsEvent);
  console.log("S3 response is: " + JSON.stringify(s3Data, null, 2));
  const response = await createDocumentFromTemplate(
    auth,
    "1btL-4GSst9OxFxKCAHueX_kOr1M53YmwbvgV8JxsqIo",
    "test",
    s3Data as any
  );

  return response;
};
