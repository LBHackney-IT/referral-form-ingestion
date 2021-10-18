import { S3Event } from "aws-lambda/trigger/s3";
import { getDataFromS3 } from "./handler";
import { mockClient } from "aws-sdk-client-mock";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

describe("#getDataFromS3()", () => {
  const mockS3 = mockClient(S3Client);

  const mockS3EventNotification = {
    Records: [
      {
        s3: {
          bucket: {
            name: "test-bucket",
          },
          object: {
            key: "test-object-key",
          },
        },
      },
    ],
  } as unknown as S3Event;

  beforeEach(() => {
    mockS3.reset();
  });

  it("should make a call to S3 when the lambda receives an event notification", async () => {
    mockS3.on(GetObjectCommand).resolves({});

    await getDataFromS3(mockS3EventNotification);

    expect(mockS3.calls()).toHaveLength(1);
  });
});
