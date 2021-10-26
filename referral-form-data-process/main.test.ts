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

  const s3ObjectArray = [
    {
      data: ["This is a test"],
      id: ["100"],
    },
  ];

  const googleAuthToken = { test: "this is a test token" } as unknown as JWT;

  beforeEach(() => {
    jest.resetAllMocks();

    (getDataFromS3 as jest.Mock).mockImplementation(() => {
      return s3ObjectArray;
    });

    (generateAuth as jest.Mock).mockImplementation(() => {
      return googleAuthToken;
    });

    (createDocumentFromTemplate as jest.Mock).mockImplementation(() => {
      return {};
    });
  });

  it("it should call #getDataFromS3 when it receives an SQS event", async () => {
    await handler(sqsTriggerEvent);

    expect(getDataFromS3).toHaveBeenCalledWith(sqsTriggerEvent);
  });

  it("it should call #generateAuth when it receives an SQS event", async () => {
    process.env.CLIENTEMAIL = "test-email";
    process.env.PRIVATEKEY = "1234";

    await handler(sqsTriggerEvent);

    expect(generateAuth).toHaveBeenCalledWith("test-email", "1234");
  });

  it("it should call #createDocumentFromTemplate when a token has been generated and form data retrieved", async () => {
    process.env.TEMPLATEDOCUMENTID = "0001111";
    process.env.TITLE = "A google document";

    await handler(sqsTriggerEvent);

    expect(createDocumentFromTemplate).toHaveBeenCalledWith(
      googleAuthToken,
      "0001111",
      "A google document",
      {
        data: ["This is a test"],
        id: ["100"],
      }
    );
  });
});
