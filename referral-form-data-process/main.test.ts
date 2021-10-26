import { SQSEvent } from "aws-lambda/trigger/sqs";
import { getDataFromS3 } from "./lib/getDataFromS3";
import { handler } from "./main";

jest.mock("./lib/getDataFromS3");

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
  });

  it("it should call #getDataFromS3 when it receives an SQS event", async () => {
    await handler(sqsTriggerEvent);

    expect(getDataFromS3).toHaveBeenCalledWith(sqsTriggerEvent);
  });
});
