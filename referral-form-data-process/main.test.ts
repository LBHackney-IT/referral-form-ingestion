import { SQSEvent } from "aws-lambda/trigger/sqs";
import { generateAuth } from "./lib/generateGoogleAuth";
import { getDataFromS3 } from "./lib/getDataFromS3";
import { handler } from "./main";

jest.mock("./lib/getDataFromS3");
jest.mock("./lib/generateGoogleAuth");

describe("#handler", () => {
  const sqsTriggerEvent = {
    Records: [{}],
  } as SQSEvent;

  const s3ObjectArray = [
    {
      data: "This is a test",
      id: ["100"],
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();

    (getDataFromS3 as jest.Mock).mockImplementation(() => {
      return s3ObjectArray;
    });

    (generateAuth as jest.Mock).mockImplementation(() => {
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
});
