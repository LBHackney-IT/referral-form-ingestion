import axios from "axios";
import { sendDataToAPI } from "./sendDataToAPI";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("#sendDataToAPI", () => {
  const testReferrerQuestion =
    "TEMP: Question for getting the referrer of the form";
  const testSupportQuestion =
    "TEMP: Question for getting the requested support";
  const testClientsQuestion =
    "TEMP: Question for getting the people being referred";
  const testReferrerAnswer = "test name";
  const testSupportAnswer = "test support";
  const testClientsAnswer = "test client";
  const testFormData = {
    [testReferrerQuestion]: [testReferrerAnswer],
    [testSupportQuestion]: [testSupportAnswer],
    [testClientsQuestion]: [testClientsAnswer],
  };
  const testDocumentUrl = "test-document-url";
  const testEndpoint = "test-endpoint-url";
  const testAPIKey = "test-key";

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.ENDPOINT_API = testEndpoint;
    process.env.AWS_KEY = testAPIKey;
  });

  it("should call the service API with the correct parameters", async () => {
    mockedAxios.post.mockResolvedValue({ data: {} });
    const mockData = {
      referrer: testReferrerAnswer,
      requestedSupport: testSupportAnswer,
      clients: [testClientsAnswer],
      referralUri: testDocumentUrl,
    };

    await sendDataToAPI(testFormData, testDocumentUrl);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${testEndpoint}/`,
      mockData,
      {
        headers: {
          "x-api-key": testAPIKey,
        },
      }
    );
  });
});
