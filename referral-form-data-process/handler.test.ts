import { S3Event } from "aws-lambda/trigger/s3";
import { getDataFromS3 } from "./handler";
import { mockClient } from "aws-sdk-client-mock";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";

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
    mockS3.on(GetObjectCommand).resolves({
      Body: new Readable({
        read() {
          this.push(JSON.stringify([{}]));
          this.push(null);
        },
      }),
    });

    await getDataFromS3(mockS3EventNotification);

    expect(mockS3.calls()).toHaveLength(1);
  });

  it("should call the S3 get object command using details from the event", async () => {
    mockS3.on(GetObjectCommand).resolves({
      Body: new Readable({
        read() {
          this.push(JSON.stringify([{}]));
          this.push(null);
        },
      }),
    });

    const expectedCommandInput = {
      Bucket: "test-bucket",
      Key: "test-object-key",
    };

    await getDataFromS3(mockS3EventNotification);

    const receivedCommandInput = mockS3.calls()[0].args[0].input;

    expect(receivedCommandInput).toStrictEqual(expectedCommandInput);
  });

  it("should receive the form data from S3 if getObject is successful", async () => {
    const mockFormData = {
      id: "100",
      data: "hello",
    };

    mockS3
      .on(GetObjectCommand, {
        Bucket: "test-bucket",
        Key: "test-object-key",
      })
      .resolves({
        Body: new Readable({
          read() {
            this.push(JSON.stringify([mockFormData]));
            this.push(null);
          },
        }),
      });

    expect(await getDataFromS3(mockS3EventNotification)).toStrictEqual([
      mockFormData,
    ]);
  });
});
