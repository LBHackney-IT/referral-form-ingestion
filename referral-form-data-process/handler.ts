import { S3Event } from "aws-lambda";

export const getDataFromS3 = async (event: S3Event) => {
  const objectPath = event.Records[0].s3.object.key;

  return {
    body: objectPath,
  };
};
