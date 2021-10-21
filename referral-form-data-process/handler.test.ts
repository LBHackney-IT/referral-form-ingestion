import { SQSEvent } from "aws-lambda";
import { main } from "./handler";
import { generateAuth } from "./lib/generateGoogleAuth";
import { getDataFromS3 } from "./lib/getDataFromS3";
import { createDocumentFromTemplate } from "./lib/createGoogleDocFromTemplate";

jest.mock("./lib/generateGoogleAuth");
jest.mock("./lib/getDataFromS3");
jest.mock("./lib/createGoogleDocFromTemplate");

describe("#main", () => {
  const mockSQSEvent = {
    Records: [],
  } as SQSEvent;

  const mockGenerateAuthResponse = "mock-generate-auth-response";
  const mockGetDataFromS3Response = "mock-get-data-from-s3-response";

  beforeEach(() => {
    jest.resetAllMocks();

    (generateAuth as jest.Mock).mockImplementation(
      () => mockGenerateAuthResponse
    );
    (getDataFromS3 as jest.Mock).mockImplementation(
      () => mockGetDataFromS3Response
    );
  });

  it("it should call to generate an auth token with our client email and private key", async () => {
    await main(mockSQSEvent);

    expect(generateAuth).toBeCalledWith(
      "test-client-email",
      "test-private-key"
    );
  });

  it("should call to get data from S3 with our SQS event object", async () => {
    await main(mockSQSEvent);

    expect(getDataFromS3).toBeCalledWith(mockSQSEvent);
  });

  it("should call to create a document and use our auth token and S3 data in the request", async () => {
    await main(mockSQSEvent);

    expect(createDocumentFromTemplate).toBeCalledWith(
      mockGenerateAuthResponse,
      "1btL-4GSst9OxFxKCAHueX_kOr1M53YmwbvgV8JxsqIo",
      "test",
      mockGetDataFromS3Response
    );
  });
});
