import { MockSpreadsheetApp } from "../__mocks__/google_mocks";
import { onFormSubmit } from "../main";
import { getProperties } from "../getProperties";
import { setUniqueIdOnSubmission } from "../setUniqueIdOnSubmission";

jest.mock("../getProperties");
jest.mock("../setUniqueIdOnSubmission");

const googleTimeStamp = "06/10/2021 10:53:17";
const googleTimeStampISO = "2021-10-06T09:53:00.000Z";

describe("#onFormSubmit()", () => {
  const mockFormData = {
    "First Name": ["Hello"],
    "Last Name": ["World"],
    Timestamp: [googleTimeStamp],
  };

  const mockEvent = {
    namedValues: mockFormData,
    range: {
      getRow() {},
    } as unknown as GoogleAppsScript.Spreadsheet.Range,
  } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

  beforeEach(() => {
    jest.resetAllMocks();

    global.Logger = {
      log: jest.fn(),
    } as unknown as GoogleAppsScript.Base.Logger;

    global.SpreadsheetApp =
      new MockSpreadsheetApp() as unknown as GoogleAppsScript.Spreadsheet.SpreadsheetApp;

    global.UrlFetchApp = {
      fetch: jest.fn(),
    } as unknown as GoogleAppsScript.URL_Fetch.UrlFetchApp;

    (getProperties as jest.Mock).mockImplementation(() => ({
      REFERRALS_SHEET_NAME: "EXAMPLE_SHEET_NAME",
      S3_ENDPOINT_API: "EXAMPLE_S3_URL",
      S3_ENDPOINT_API_KEY: "EXAMPLE_API_KEY",
      FORM_SUBMISSION_ID_COLUMN_POSITION: "1",
    }));

    (setUniqueIdOnSubmission as jest.Mock).mockImplementation(() => {
      return { id: 1, row: 1 };
    });
  });

  it("should log an error when getProperties throws an error", () => {
    const message = "test name";
    (getProperties as jest.Mock).mockImplementationOnce(() => {
      throw new Error(message);
    });

    onFormSubmit(mockEvent);

    expect(global.Logger.log).toHaveBeenCalledWith(
      JSON.stringify({
        timeStamp: googleTimeStampISO,
        errorMessage: message,
      })
    );
  });

  it("should get the active sheet for storing the MASH referrals", () => {
    // Arrange: Set up mocks and their return values
    (
      MockSpreadsheetApp.mockActiveSpreadsheet
        .getSheetByName as jest.Mock<GoogleAppsScript.Spreadsheet.Sheet>
    ).mockImplementation(() => {
      return MockSpreadsheetApp.mockActiveSheet;
    });

    // Act: Trigger event when form is submitted
    onFormSubmit(mockEvent);

    // Assertion: Gets the active sheet
    expect(
      MockSpreadsheetApp.mockActiveSpreadsheet.getSheetByName
    ).toHaveBeenCalledWith("EXAMPLE_SHEET_NAME");
  });

  it("should log an error when setUniqueIdOnSubmission throws one", () => {
    const message = "Error";
    (setUniqueIdOnSubmission as jest.Mock).mockImplementationOnce(() => {
      throw new Error(message);
    });

    onFormSubmit(mockEvent);

    expect(global.Logger.log).toHaveBeenCalledWith(
      JSON.stringify({
        timeStamp: googleTimeStampISO,
        errorMessage: message,
      })
    );
  });

  it("should call setUniqueIdOnSubmission with the correct parameters", () => {
    const mockSetUniqueIdOnSubmission = setUniqueIdOnSubmission as jest.Mock;

    onFormSubmit(mockEvent);

    expect(mockSetUniqueIdOnSubmission).toBeCalledWith(
      undefined,
      "1",
      mockEvent
    );
  });

  it("should send the form data with its ID & spreadsheet row to AWS for further processing", () => {
    const submissionId = "1";
    const rowPosition = "1";

    const formDataWithId = mockEvent.namedValues;
    formDataWithId.FormSubmissionId = [submissionId];
    formDataWithId.SubmissionRowPosition = [rowPosition];

    const options = {
      method: "put",
      headers: { "X-API-KEY": "EXAMPLE_API_KEY" },
      contentType: "application/json",
      payload: JSON.stringify(formDataWithId),
    };

    // Act: Trigger event when form is submitted
    onFormSubmit(mockEvent);

    // Assertion: Form submission data including generated unique ID sent to AWS
    expect(global.UrlFetchApp.fetch).toHaveBeenCalledWith(
      `EXAMPLE_S3_URL/form-submissions/${submissionId}`,
      options
    );
  });
});
