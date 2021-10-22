import { SQSEvent } from "aws-lambda";
import { main } from "./handler";
import { generateAuth } from "./lib/generateGoogleAuth";
import { getDataFromS3 } from "./lib/getDataFromS3";
import { createDocumentFromTemplate } from "./lib/createGoogleDocFromTemplate";
import { addGoogleDocUrlToSheet } from "./lib/addGoogleDocUrlToSheet";

jest.mock("./lib/generateGoogleAuth");
jest.mock("./lib/getDataFromS3");
jest.mock("./lib/createGoogleDocFromTemplate");
jest.mock("./lib/addGoogleDocUrlToSheet");

describe("#main", () => {
  const mockSQSEvent = {
    Records: [],
  } as SQSEvent;

  const mockGenerateAuthResponse = "mock-generate-auth-response";
  const mockGetDataFromS3Response = "mock-get-data-from-s3-response";
  const testDocumentId = "test-document-id";

  beforeAll(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date(2020, 3, 1, 14, 50, 20));
  });

  beforeEach(() => {
    jest.resetAllMocks();

    (generateAuth as jest.Mock).mockImplementation(
      () => mockGenerateAuthResponse
    );
    (getDataFromS3 as jest.Mock).mockImplementation(
      () => mockGetDataFromS3Response
    );
    (createDocumentFromTemplate as jest.Mock).mockImplementation(() => ({
      documentId: "testDocumentId",
    }));
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
      "test-template-document-id",
      "Test - 2020-04-01T13:50:20.000Z",
      mockGetDataFromS3Response
    );
  });

  it("should call to add the created document url to a google sheet", async () => {
    await main(mockSQSEvent);

    expect(addGoogleDocUrlToSheet).toBeCalledWith(
      mockGenerateAuthResponse,
      "https://docs.google.com/spreadsheets/d/testDocumentId/edit",
      "test-url-column",
      "1"
    );
  });
});
