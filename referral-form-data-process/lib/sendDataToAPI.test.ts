import axios from "axios";
import { sendDataToAPI } from "./sendDataToAPI";
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("#sendDataToAPI", () => {
  const referrerFirstNameQuestion = "Referrer First Name";
  const referrerLastNameQuestion = "Referrer Last Name";
  const requestedSupportQuestion =
    "What support do you think the child(ren) would benefit from?";

  const referrerFirstNameAnswer = "Joey";
  const referrerLastNameAnswer = "Brown";
  const requestedSupportAnswer = "Test Support";

  const childOneFirstNameQuestion = "Child 1: Child's First Name";
  const childOneLastNameQuestion = "Child 1: Child's Last Name";
  const childOneDateOfBirthQuestion =
    "Child 1: Child's date of birth or EDD for unborns ";
  const childOneGenderQuestion =
    "Child 1: Gender - Which of the following describes how the child thinks of themself?";
  const childOneEthnicityQuestion = "Child 1: Ethnicity";
  const childOneFirstLanguageQuestion = "Child 1: Language";
  const childOneSchoolQuestion = "Child 1: School ";
  const childOneAddressLineOneQuestion = "Child 1: Home address line 1";
  const childOneAddressLineTwoQuestion = "Child 1: Home address line 2";
  const childOneAddressLineThreeQuestion = "Child 1: Home address line 3";
  const childOnePostcodeQuestion = "Child 1: Postcode";

  const childOneFirstNameAnswer = "Apple";
  const childOneLastNameAnswer = "Cinnamon";
  const childOneDateOfBirthAnswer = "01/11/2011";
  const childOneGenderAnswer = "Female";
  const childOneEthnicityAnswer = "cute";
  const childOneFirstLanguageAnswer = "Typescript";
  const childOneSchoolAnswer = "A Primary School";
  const childOneAddressLineOneAnswer = "100 Central Park";
  const childOneAddressLineTwoAnswer = "New York";
  const childOneAddressLineThreeAnswer = "";
  const childOnePostcodeAnswer = "AB12 3CD";

  const testFormData: Record<string, string[]> = {
    [referrerFirstNameQuestion]: [referrerFirstNameAnswer],
    [referrerLastNameQuestion]: [referrerLastNameAnswer],
    [requestedSupportQuestion]: [requestedSupportAnswer],
    [childOneFirstNameQuestion]: [childOneFirstNameAnswer],
    [childOneLastNameQuestion]: [childOneLastNameAnswer],
    [childOneDateOfBirthQuestion]: [childOneDateOfBirthAnswer],
    [childOneGenderQuestion]: [childOneGenderAnswer],
    [childOneEthnicityQuestion]: [childOneEthnicityAnswer],
    [childOneFirstLanguageQuestion]: [childOneFirstLanguageAnswer],
    [childOneSchoolQuestion]: [childOneSchoolAnswer],
    [childOneAddressLineOneQuestion]: [childOneAddressLineOneAnswer],
    [childOneAddressLineTwoQuestion]: [childOneAddressLineTwoAnswer],
    [childOneAddressLineThreeQuestion]: [childOneAddressLineThreeAnswer],
    [childOnePostcodeQuestion]: [childOnePostcodeAnswer],
  };

  const testDocumentUrl = "test-document-url";
  const testEndpoint = "test-endpoint-url";
  const testAPIKey = "test-key";
  const dateOfBirthISOFormat = "2011-11-01";

  const mashResidentPostRequest = {
    firstName: childOneFirstNameAnswer,
    lastName: childOneLastNameAnswer,
    dateOfBirth: dateOfBirthISOFormat,
    gender: childOneGenderAnswer,
    ethnicity: childOneEthnicityAnswer,
    firstLanguage: childOneFirstLanguageAnswer,
    school: childOneSchoolAnswer,
    address: `${childOneAddressLineOneAnswer} ${childOneAddressLineTwoAnswer} ${childOneAddressLineThreeAnswer}`,
    postcode: childOnePostcodeAnswer,
  };

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.ENDPOINT_API = testEndpoint;
    process.env.AWS_KEY = testAPIKey;
  });

  it("should call the service API with the correct parameters", async () => {
    mockedAxios.post.mockResolvedValue({ data: {} });
    const mockData = {
      referrer: `${referrerFirstNameAnswer} ${referrerLastNameAnswer}`,
      requestedSupport: requestedSupportAnswer,
      referralUri: testDocumentUrl,
      mashResidents: [mashResidentPostRequest],
    };

    await sendDataToAPI(testFormData, testDocumentUrl);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${testEndpoint}/api/v1/mash-referral`,
      mockData,
      {
        headers: {
          "x-api-key": testAPIKey,
        },
      }
    );
  });

  // it("should send the correct number of clients if multiple clients are inputted", async () => {
  //   const testClientTwoFirstNameQuestion = "Child 2: Child's First Name";
  //   const testClientTwoLastNameQuestion = "Child 2: Child's Last Name";
  //   const testClientTwoFirstNameAnswer = "Client";
  //   const testClientTwoLastNameAnswer = "Two";
  //   const testClientTwoCompleteName = "Client Two";
  //   const testFormData = {
  //     [testReferrerFirstNameQuestion]: [testReferrerFirstNameAnswer],
  //     [testReferrerLastNameQuestion]: [testReferrerLastNameAnswer],
  //     [testSupportQuestion]: [testSupportAnswer],
  //     [testClientOneFirstNameQuestion]: [testClientOneFirstNameAnswer],
  //     [testClientOneLastNameQuestion]: [testClientOneLastNameAnswer],
  //     [testClientTwoFirstNameQuestion]: [testClientTwoFirstNameAnswer],
  //     [testClientTwoLastNameQuestion]: [testClientTwoLastNameAnswer],
  //   };
  //   mockedAxios.post.mockResolvedValue({ data: {} });
  //   const mockData = {
  //     referrer: `${testReferrerFirstNameAnswer} ${testReferrerLastNameAnswer}`,
  //     requestedSupport: testSupportAnswer,
  //     clients: [testClientOneCompleteName, testClientTwoCompleteName],
  //     referralUri: testDocumentUrl,
  //   };

  //   await sendDataToAPI(testFormData, testDocumentUrl);

  //   expect(mockedAxios.post).toHaveBeenCalledWith(
  //     `${testEndpoint}/api/v1/mash-referral`,
  //     mockData,
  //     {
  //       headers: {
  //         "x-api-key": testAPIKey,
  //       },
  //     }
  //   );
  // });
});
