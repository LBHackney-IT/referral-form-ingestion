import { SQSEvent } from "aws-lambda";
import { createDocumentFromTemplate } from "./lib/createGoogleDocFromTemplate";
import { generateAuth } from "./lib/generateGoogleAuth";
import { getDataFromS3 } from "./lib/getDataFromS3";

export const main = async (sqsEvent: SQSEvent) => {
  const auth = await generateAuth(
    process.env.CLIENT_EMAIL as string,
    process.env.PRIVATE_KEY as string
  );

  console.log(
    "🚀 ~ file: handler.ts ~ line 14 ~ main ~ CLIENT_EMAIL",
    process.env.CLIENT_EMAIL
  );
  console.log(
    "🚀 ~ file: handler.ts ~ line 18 ~ main ~ PRIVATE_KEY",
    process.env.PRIVATE_KEY
  );

  const s3Data = await getDataFromS3(sqsEvent);
  console.log("🚀 ~ file: handler.ts ~ line 22 ~ main ~ s3Data", JSON.stringify(s3Data, null, 2))
  
  const createdDocument = await createDocumentFromTemplate(
    auth,
    "1btL-4GSst9OxFxKCAHueX_kOr1M53YmwbvgV8JxsqIo",
    "test",
    s3Data as any
  );

  console.log("🚀 ~ file: handler.ts ~ line 30 ~ main ~ createdDocument", JSON.stringify(createdDocument, null, 2))

  // update spreadsheet

  // call to API

  return "completed";
};
