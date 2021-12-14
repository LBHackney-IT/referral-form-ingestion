import { SQSEvent } from "aws-lambda/trigger/sqs";
import { JWT } from "google-auth-library";
import { createDocumentFromTemplate } from "./lib/createGoogleDocFromTemplate";
import { addGoogleDocUrlToSheet } from "./lib/addGoogleDocUrlToSheet";
import { generateAuth } from "./lib/generateGoogleAuth";
import { getDataFromS3 } from "./lib/getDataFromS3";
import { handler } from "./main";
import { sendDataToAPI } from "./lib/sendDataToAPI";
import { generateGoogleDocumentTitle } from "./lib/generateGoogleDocumentTitle";

jest.mock("./lib/getDataFromS3");
jest.mock("./lib/generateGoogleAuth");
jest.mock("./lib/createGoogleDocFromTemplate");
jest.mock("./lib/addGoogleDocUrlToSheet");
jest.mock("./lib/sendDataToAPI");
jest.mock("./lib/generateGoogleDocumentTitle");

describe("#handler", () => {
  const testEmail = "test@email.com";
  const testKey = "1234";
  const testTemplateId = "0001111";
  const testDocumentTitle = "Test Document | MASH";
  const urlColumn = "1";
  const documentId = "12345";

  const googleAuthToken = { test: "this is a test token" } as unknown as JWT;

  const sqsTriggerEvent = {
    Records: [{}],
  } as SQSEvent;

  const singleS3ObjectArray = [
    {
      data: ["This is a test"],
      id: ["100"],
      SubmissionRowPosition: ["1"],
    },
  ];

  const multipleS3ObjectArray = [
    {
      data: ["This is one"],
      id: ["1"],
      SubmissionRowPosition: ["2"],
    },
    {
      name: ["This is another"],
      id: ["10"],
      SubmissionRowPosition: ["3"],
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();

    (getDataFromS3 as jest.Mock).mockImplementation(() => {
      return singleS3ObjectArray;
    });

    (generateAuth as jest.Mock).mockImplementation(() => {
      return googleAuthToken;
    });

    (generateGoogleDocumentTitle as jest.Mock).mockImplementation(() => {
      return testDocumentTitle;
    });

    (createDocumentFromTemplate as jest.Mock).mockImplementation(() => {
      return { documentId: documentId };
    });

    (addGoogleDocUrlToSheet as jest.Mock).mockImplementation(() => {
      return {};
    });

    (sendDataToAPI as jest.Mock).mockImplementation(() => {
      return undefined;
    });

    process.env.CLIENT_EMAIL = testEmail;
    process.env.PRIVATE_KEY = testKey;
    process.env.TEMPLATE_DOCUMENT_ID = testTemplateId;
    process.env.URL_COLUMN = urlColumn;
  });

  it("it should call #getDataFromS3 when it receives an SQS event", async () => {
    await handler(sqsTriggerEvent);

    expect(getDataFromS3).toHaveBeenCalledWith(sqsTriggerEvent);
  });

  it("it should call #generateAuth when it receives an SQS event", async () => {
    await handler(sqsTriggerEvent);

    expect(generateAuth).toHaveBeenCalledWith(testEmail, testKey);
  });

  it("should call #generateGoogleDocumentTitle to create a title for the Google doc", async () => {
    await handler(sqsTriggerEvent);

    expect(generateGoogleDocumentTitle).toBeCalledWith(singleS3ObjectArray[0]);
  });

  it("it should call #createDocumentFromTemplate when a token has been generated and form data retrieved", async () => {
    await handler(sqsTriggerEvent);

    expect(createDocumentFromTemplate).toHaveBeenCalledWith(
      googleAuthToken,
      testTemplateId,
      testDocumentTitle,
      singleS3ObjectArray[0]
    );
  });

  it("it should call loop through all retrieved objects and create a google document for each", async () => {
    (getDataFromS3 as jest.Mock).mockImplementation(() => {
      return multipleS3ObjectArray;
    });

    await handler(sqsTriggerEvent);

    expect(createDocumentFromTemplate).toHaveBeenNthCalledWith(
      1,
      googleAuthToken,
      testTemplateId,
      testDocumentTitle,
      multipleS3ObjectArray[0]
    );

    expect(createDocumentFromTemplate).toHaveBeenNthCalledWith(
      2,
      googleAuthToken,
      testTemplateId,
      testDocumentTitle,
      multipleS3ObjectArray[1]
    );
  });

  it("should call #addGoogleDocUrlToSheet to add the created document url to a google sheet", async () => {
    const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;
    await handler(sqsTriggerEvent);

    expect(addGoogleDocUrlToSheet).toBeCalledWith(
      googleAuthToken,
      documentUrl,
      urlColumn,
      singleS3ObjectArray[0].SubmissionRowPosition.toString()
    );
  });

  it("should call #sendDataToApi to send certain submission data to the service API", async () => {
    const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;

    await handler(sqsTriggerEvent);

    expect(sendDataToAPI).toBeCalledWith(singleS3ObjectArray[0], documentUrl);
  });
});
