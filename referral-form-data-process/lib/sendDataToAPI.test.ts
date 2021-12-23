import axios from "axios";
import { sendDataToAPI } from "./sendDataToAPI";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("#sendDataToAPI", () => {
  //Referrer related questions
  const referrerFirstNameQuestion = "Referrer First Name";
  const referrerLastNameQuestion = "Referrer Last Name";
  const requestedSupportQuestion =
    "What support do you think the child(ren) would benefit from?";

  //Referrer related answers
  const referrerFirstNameAnswer = "Joey";
  const referrerLastNameAnswer = "Brown";
  const requestedSupportAnswer = "Test Support";

  //Child one related questions
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

  //Child one related answers
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

  //Child one Date of Birth in ISO format
  const childOneDateOfBirthISOFormat = "2011-11-01";

  //Child two related questions
  const childTwoFirstNameQuestion = "Child 2: Child's First Name";
  const childTwoLastNameQuestion = "Child 2: Child's Last Name";
  const childTwoDateOfBirthQuestion =
    "Child 2: Child's date of birth or EDD for unborns ";
  const childTwoGenderQuestion =
    "Child 2: Gender - Which of the following describes how the child thinks of themself?";
  const childTwoEthnicityQuestion = "Child 2: Ethnicity";
  const childTwoFirstLanguageQuestion = "Child 2: Language";
  const childTwoSchoolQuestion = "Child 2: School ";
  const childTwoAddressLineOneQuestion = "Child 2: Home address line 1";
  const childTwoAddressLineTwoQuestion = "Child 2: Home address line 2";
  const childTwoAddressLineThreeQuestion = "Child 2: Home address line 3";
  const childTwoPostcodeQuestion = "Child 2: Postcode";

  //Child two related answers
  const childTwoFirstNameAnswer = "BlueBerry";
  const childTwoLastNameAnswer = "Pie";
  const childTwoDateOfBirthAnswer = "11/12/2000";
  const childTwoGenderAnswer = "Male";
  const childTwoEthnicityAnswer = "smart";
  const childTwoFirstLanguageAnswer = "Ruby";
  const childTwoSchoolAnswer = "A Secondary School";
  const childTwoAddressLineOneAnswer = "200 Example Avenue";
  const childTwoAddressLineTwoAnswer = "London";
  const childTwoAddressLineThreeAnswer = "";
  const childTwoPostcodeAnswer = "AA11 32BB";

  //Child two Date of Birth in ISO format
  const childTwoDateOfBirthISOFormat = "2000-12-11";

  // Expected MASH resident details object for child one
  const mashResidentDetailsChildOne = {
    firstName: childOneFirstNameAnswer,
    lastName: childOneLastNameAnswer,
    dateOfBirth: childOneDateOfBirthISOFormat,
    gender: childOneGenderAnswer,
    ethnicity: childOneEthnicityAnswer,
    firstLanguage: childOneFirstLanguageAnswer,
    school: childOneSchoolAnswer,
    address: `${childOneAddressLineOneAnswer} ${childOneAddressLineTwoAnswer} ${childOneAddressLineThreeAnswer}`,
    postcode: childOnePostcodeAnswer,
  };

  // Expected MASH resident details object for child two
  const mashResidentDetailsChildTwo = {
    firstName: childTwoFirstNameAnswer,
    lastName: childTwoLastNameAnswer,
    dateOfBirth: childTwoDateOfBirthISOFormat,
    gender: childTwoGenderAnswer,
    ethnicity: childTwoEthnicityAnswer,
    firstLanguage: childTwoFirstLanguageAnswer,
    school: childTwoSchoolAnswer,
    address: `${childTwoAddressLineOneAnswer} ${childTwoAddressLineTwoAnswer} ${childTwoAddressLineThreeAnswer}`,
    postcode: childTwoPostcodeAnswer,
  };

  const testDocumentUrl = "test-document-url";
  const testEndpoint = "test-endpoint-url";
  const testAPIKey = "test-key";

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.ENDPOINT_API = testEndpoint;
    process.env.AWS_KEY = testAPIKey;
  });

  it("should call the service API with the correct parameters for a single resident in a referral", async () => {
    mockedAxios.post.mockResolvedValue({ data: {} });

    const testFormDataForSingle: Record<string, string[]> = {
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

    const mockData = {
      referrer: `${referrerFirstNameAnswer} ${referrerLastNameAnswer}`,
      requestedSupport: requestedSupportAnswer,
      referralUri: testDocumentUrl,
      mashResidents: [mashResidentDetailsChildOne],
    };

    await sendDataToAPI(testFormDataForSingle, testDocumentUrl);

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

  it("should send the correct number of clients if multiple clients are in a referral", async () => {
    mockedAxios.post.mockResolvedValue({ data: {} });

    const testFormDataForMultiple: Record<string, string[]> = {
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
      [childTwoFirstNameQuestion]: [childTwoFirstNameAnswer],
      [childTwoLastNameQuestion]: [childTwoLastNameAnswer],
      [childTwoDateOfBirthQuestion]: [childTwoDateOfBirthAnswer],
      [childTwoGenderQuestion]: [childTwoGenderAnswer],
      [childTwoEthnicityQuestion]: [childTwoEthnicityAnswer],
      [childTwoFirstLanguageQuestion]: [childTwoFirstLanguageAnswer],
      [childTwoSchoolQuestion]: [childTwoSchoolAnswer],
      [childTwoAddressLineOneQuestion]: [childTwoAddressLineOneAnswer],
      [childTwoAddressLineTwoQuestion]: [childTwoAddressLineTwoAnswer],
      [childTwoAddressLineThreeQuestion]: [childTwoAddressLineThreeAnswer],
      [childTwoPostcodeQuestion]: [childTwoPostcodeAnswer],
    };

    const mockData = {
      referrer: `${referrerFirstNameAnswer} ${referrerLastNameAnswer}`,
      requestedSupport: requestedSupportAnswer,
      referralUri: testDocumentUrl,
      mashResidents: [mashResidentDetailsChildOne, mashResidentDetailsChildTwo],
    };

    await sendDataToAPI(testFormDataForMultiple, testDocumentUrl);

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
});
