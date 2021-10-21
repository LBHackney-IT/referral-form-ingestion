import { S3EventRecord, SQSEvent } from "aws-lambda";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";

export const getDataFromS3 = async (sqsEvent: SQSEvent) => {
  const client = new S3Client({ region: "eu-west-2" });
  const events: Array<S3EventRecord> = sqsEvent.Records.map(
    (message) => JSON.parse(message.body).Records
  ).flat();

  return (
    await Promise.all(events.map((event) => processEvent(event, client)))
  ).flat();
};

export const processEvent = async (event: S3EventRecord, client: S3Client) => {
  const objectPath = event.s3.object.key;
  const bucketName = event.s3.bucket.name;

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
