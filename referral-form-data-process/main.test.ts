import { SQSEvent } from "aws-lambda/trigger/sqs";
import { JWT } from "google-auth-library";
import { createDocumentFromTemplate } from "./lib/createGoogleDocFromTemplate";
import { addGoogleDocUrlToSheet } from "./lib/addGoogleDocUrlToSheet";
import { generateAuth } from "./lib/generateGoogleAuth";
import { getDataFromS3 } from "./lib/getDataFromS3";
import { handler } from "./main";
import { sendDataToAPI } from "./lib/sendDataToAPI";

jest.mock("./lib/getDataFromS3");
jest.mock("./lib/generateGoogleAuth");
jest.mock("./lib/createGoogleDocFromTemplate");
jest.mock("./lib/addGoogleDocUrlToSheet");
jest.mock("./lib/sendDataToAPI");

describe("#handler", () => {
  const sqsTriggerEvent = {
    Records: [{}],
  } as SQSEvent;

  const singleS3ObjectArray = [
    {
      data: ["This is a test"],
      id: ["100"],
      FormRow: ["1"],
    },
  ];

  const multipleS3ObjectArray = [
    {
      data: ["This is one"],
      id: ["1"],
      FormRow: ["2"],
    },
    {
      name: ["This is another"],
      id: ["10"],
      FormRow: ["3"],
    },
  ];

  const testEmail = "test@email.com";
  const testKey = "1234";
  const testTemplateId = "0001111";
  const testTitle = "A google document";
  const urlColumn = "1";
  const documentId = "12345";

  const googleAuthToken = { test: "this is a test token" } as unknown as JWT;

  beforeEach(() => {
    jest.resetAllMocks();

    (getDataFromS3 as jest.Mock).mockImplementation(() => {
      return singleS3ObjectArray;
    });

    (generateAuth as jest.Mock).mockImplementation(() => {
      return googleAuthToken;
    });

    (createDocumentFromTemplate as jest.Mock).mockImplementation(() => {
      return { documentId: documentId };
    });

    (addGoogleDocUrlToSheet as jest.Mock).mockImplementation(() => {
      return {};
    });

    (sendDataToAPI as jest.Mock).mockImplementation(() => {
      return {};
    });

    process.env.CLIENT_EMAIL = testEmail;
    process.env.PRIVATE_KEY = testKey;
    process.env.TEMPLATE_DOCUMENT_ID = testTemplateId;
    process.env.TITLE = testTitle;
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

  it("it should call #createDocumentFromTemplate when a token has been generated and form data retrieved", async () => {
    await handler(sqsTriggerEvent);

    expect(createDocumentFromTemplate).toHaveBeenCalledWith(
      googleAuthToken,
      testTemplateId,
      testTitle,
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
      testTitle,
      multipleS3ObjectArray[0]
    );

    expect(createDocumentFromTemplate).toHaveBeenNthCalledWith(
      2,
      googleAuthToken,
      testTemplateId,
      testTitle,
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
      singleS3ObjectArray[0].FormRow.toString()
    );
  });

  it("should call #sendDataToApi to send certain submission data to the service API", async () => {
    const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;

    await handler(sqsTriggerEvent);

    expect(sendDataToAPI).toBeCalledWith(singleS3ObjectArray[0], documentUrl);
  });
});
