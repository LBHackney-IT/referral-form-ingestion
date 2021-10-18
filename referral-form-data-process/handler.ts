import { S3Event } from "aws-lambda";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const getDataFromS3 = async (event: S3Event) => {
  const client = new S3Client({ region: "eu-west-2" });

  const objectPath = event.Records[0].s3.object.key;
  const bucketName = event.Records[0].s3.bucket.name;

  const getObjectParams = {
    Bucket: bucketName,
    Key: objectPath,
  };

  const command = new GetObjectCommand(getObjectParams);

  await client.send(command);
};
