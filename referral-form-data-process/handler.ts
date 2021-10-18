import { S3Event, SQSEvent } from "aws-lambda";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";

export const getDataFromS3 = async (sqsEvent: SQSEvent) => {
  const client = new S3Client({ region: "eu-west-2" });

  const s3Event = JSON.parse(sqsEvent.Records[0].body) as S3Event;

  const objectPath = s3Event.Records[0].s3.object.key;
  const bucketName = s3Event.Records[0].s3.bucket.name;

  const getObjectParams = {
    Bucket: bucketName,
    Key: objectPath,
  };

  const command = new GetObjectCommand(getObjectParams);

  const mashDataFromS3 = await client.send(command);

  return await new Promise((resolve) => {
    const formDataChunks: any[] = [];
    (mashDataFromS3.Body as Readable).on("data", (chunk) =>
      formDataChunks.push(chunk)
    );
    (mashDataFromS3.Body as Readable).on("end", () =>
      resolve(JSON.parse(Buffer.concat(formDataChunks).toString("utf8")))
    );
  });
};
