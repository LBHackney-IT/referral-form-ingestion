import { S3Event } from "aws-lambda";
import AWS from "aws-sdk";

export const getDataFromS3 = (event: S3Event) => {
  const s3 = new AWS.S3();

  const objectPath = event.Records[0].s3.object.key;
  const bucketName = event.Records[0].s3.bucket.name;

  const params = {
    Bucket: bucketName,
    Key: objectPath,
  };

  s3.getObject(params);
};
