import { S3Event } from "aws-lambda/trigger/s3";
import { getDataFromS3 } from "./handler";

describe("#getDataFromS3()", () => {
  const mockS3 = {
    getObject: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  };

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
    jest.resetAllMocks();

    jest.mock("aws-sdk", () => {
      return { S3: jest.fn(() => mockS3) };
    });
  });

  it("should get the object from S3 using details from the event", () => {
    getDataFromS3(mockS3EventNotification);

    expect(mockS3.getObject).toBeCalledWith({
      Bucket: "test-bucket",
      Key: "test-object-key",
    });
  });
});
