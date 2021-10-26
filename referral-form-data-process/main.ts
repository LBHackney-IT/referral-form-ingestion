import { SQSEvent } from "aws-lambda";
import { getDataFromS3 } from "./lib/getDataFromS3";

export const handler = async (sqsEvent: SQSEvent) => {
  const formDataObjects = await getDataFromS3(sqsEvent);
};
