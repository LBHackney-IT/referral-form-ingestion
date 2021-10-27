import { SQSEvent } from "aws-lambda/trigger/sqs";
import { JWT } from "google-auth-library";
import { createDocumentFromTemplate } from "./lib/createGoogleDocFromTemplate";
import { generateAuth } from "./lib/generateGoogleAuth";
import { getDataFromS3 } from "./lib/getDataFromS3";
import { handler } from "./main";

jest.mock("./lib/getDataFromS3");
jest.mock("./lib/generateGoogleAuth");
jest.mock("./lib/createGoogleDocFromTemplate");

describe("#handler", () => {
  const sqsTriggerEvent = {
    Records: [{}],
  } as SQSEvent;

  const singleS3ObjectArray = [
    {
      data: ["This is a test"],
      id: ["100"],
    },
  ];

  const multipleS3ObjectArray = [
    {
      data: ["This is one"],
      id: ["1"],
    },
    {
      name: ["This is another"],
      id: ["10"],
    },
  ];

  const testEmail = "test@email.com";
  const testKey = "1234";
  const testTemplateId = "0001111";
  const testTitle = "A google document";

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
      return {};
    });

    process.env.CLIENTEMAIL = testEmail;
    process.env.PRIVATEKEY = testKey;
    process.env.TEMPLATEDOCUMENTID = testTemplateId;
    process.env.TITLE = testTitle;
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
});
