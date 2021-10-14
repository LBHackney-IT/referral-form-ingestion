import { S3Event } from "aws-lambda/trigger/s3";
import { getDataFromS3 } from "./handler";

describe("#getDataFromS3()", () => {
  it("should get the object ID from S3 event", async () => {
    const mockS3EventNotification = {
      Records: [
        {
          s3: {
            object: {
              key: "object-key",
              size: "object-size in bytes",
              eTag: "object eTag",
            },
          },
        },
      ],
    } as unknown as S3Event;

    const response = await getDataFromS3(mockS3EventNotification);

    expect(response.body).toBe("object-key");
  });
});
