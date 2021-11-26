import axios from "axios";
import { sendDataToAPI } from "./sendDataToAPI";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("#sendDataToAPI", () => {
  const testReferrerFirstNameQuestion = "Referrer First Name";
  const testReferrerLastNameQuestion = "Referrer Last Name";
  const testSupportQuestion =
    "What support do you think the child(ren) would benefit from?";
  const testClientOneFirstNameQuestion = "Child 1: Child's First Name";
  const testClientOneLastNameQuestion = "Child 1: Child's Last Name";
  const testReferrerFirstNameAnswer = "First";
  const testReferrerLastNameAnswer = "Referrer";
  const testSupportAnswer = "test support";
  const testClientOneFirstNameAnswer = "Client";
  const testClientOneLastNameAnswer = "One";
  const testClientOneCompleteName = "Client One";
  const testFormData = {
    [testReferrerFirstNameQuestion]: [testReferrerFirstNameAnswer],
    [testReferrerLastNameQuestion]: [testReferrerLastNameAnswer],
    [testSupportQuestion]: [testSupportAnswer],
    [testClientOneFirstNameQuestion]: [testClientOneFirstNameAnswer],
    [testClientOneLastNameQuestion]: [testClientOneLastNameAnswer],
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
      referrer: `${testReferrerFirstNameAnswer} ${testReferrerLastNameAnswer}`,
      requestedSupport: testSupportAnswer,
      clients: [testClientOneCompleteName],
      referralUri: testDocumentUrl,
    };

    await sendDataToAPI(testFormData, testDocumentUrl);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${testEndpoint}/mash-referral`,
      mockData,
      {
        headers: {
          "x-api-key": testAPIKey,
        },
      }
    );
  });

  it("should send the correct number of clients if multiple clients are inputted", async () => {
    const testClientTwoFirstNameQuestion = "Child 2: Child's First Name";
    const testClientTwoLastNameQuestion = "Child 2: Child's Last Name";
    const testClientTwoFirstNameAnswer = "Client";
    const testClientTwoLastNameAnswer = "Two";
    const testClientTwoCompleteName = "Client Two";
    const testFormData = {
      [testReferrerFirstNameQuestion]: [testReferrerFirstNameAnswer],
      [testReferrerLastNameQuestion]: [testReferrerLastNameAnswer],
      [testSupportQuestion]: [testSupportAnswer],
      [testClientOneFirstNameQuestion]: [testClientOneFirstNameAnswer],
      [testClientOneLastNameQuestion]: [testClientOneLastNameAnswer],
      [testClientTwoFirstNameQuestion]: [testClientTwoFirstNameAnswer],
      [testClientTwoLastNameQuestion]: [testClientTwoLastNameAnswer],
    };
    mockedAxios.post.mockResolvedValue({ data: {} });
    const mockData = {
      referrer: `${testReferrerFirstNameAnswer} ${testReferrerLastNameAnswer}`,
      requestedSupport: testSupportAnswer,
      clients: [testClientOneCompleteName, testClientTwoCompleteName],
      referralUri: testDocumentUrl,
    };

    await sendDataToAPI(testFormData, testDocumentUrl);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${testEndpoint}/mash-referral`,
      mockData,
      {
        headers: {
          "x-api-key": testAPIKey,
        },
      }
    );
  });
});
