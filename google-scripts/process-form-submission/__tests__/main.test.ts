import {
  MockPropertiesService,
  MockSpreadsheetApp,
} from "../__mocks__/google_mocks";
import { onFormSubmit } from "../main";

describe("#onFormSubmit()", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    global.Logger = {
      log: jest.fn(),
    } as unknown as GoogleAppsScript.Base.Logger;

    global.PropertiesService =
      new MockPropertiesService() as unknown as GoogleAppsScript.Properties.PropertiesService;

    global.SpreadsheetApp =
      new MockSpreadsheetApp() as unknown as GoogleAppsScript.Spreadsheet.SpreadsheetApp;

    global.UrlFetchApp = {
      fetch: jest.fn(),
    } as unknown as GoogleAppsScript.URL_Fetch.UrlFetchApp;
  });

  it("should get the active sheet for storing the MASH referrals", () => {
    // Arrange: Set up mocks and their return values
    (
      MockSpreadsheetApp.mockActiveSpreadsheet
        .getSheetByName as jest.Mock<GoogleAppsScript.Spreadsheet.Sheet>
    ).mockImplementation(() => {
      return MockSpreadsheetApp.mockActiveSheet;
    });

    (
      MockPropertiesService.mockProperties.getProperty as jest.Mock<string>
    ).mockImplementation((a) => {
      return a === "MASH_SHEET_NAME" ? "EXAMPLE_SHEET_NAME" : "";
    });

    // Arrange: Form submission event
    const mockEvent = {
      sample: "event",
      range: {
        getRow() {},
      } as unknown as GoogleAppsScript.Spreadsheet.Range,
    } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

    // Act: Trigger event when form is submitted
    onFormSubmit(mockEvent);

    // Assertion: Gets the active sheet
    expect(
      MockSpreadsheetApp.mockActiveSpreadsheet.getSheetByName
    ).toHaveBeenCalledWith("EXAMPLE_SHEET_NAME");
  });

  it("should return an error if the active sheet is not found", () => {
    /* 
    Arrange: Set up mocks and their return values:
    Explicitly setting the mock to return null, otherwise it will return undefined
    */

    (
      MockSpreadsheetApp.mockActiveSpreadsheet.getSheetByName as jest.Mock<null>
    ).mockImplementation(() => {
      return null;
    });

    // Arrange: Form submission event and error message
    const sheetNotFoundError = new Error(
      "Sheet by name method returned null or undefined"
    );

    const mockEvent = {
      sample: "event",
      range: {
        getRow() {},
      } as unknown as GoogleAppsScript.Spreadsheet.Range,
    } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

    try {
      // Act: Trigger event when form is submitted
      onFormSubmit(mockEvent);
    } catch (e) {
      // Assertion: Logs error message if the sheet is null
      expect(e).toEqual(sheetNotFoundError);
    }
  });

  it("should log the form data, event & error message when an error occurs", () => {
    /* 
    Arrange: Set up mocks and their return values:
    When not explicitly set, the mocks will return undefined
    --------------------------------------------------------
    Arrange: Form submission event and error message
    */

    const sheetNotFoundError = new Error(
      "Sheet by name method returned null or undefined"
    );

    const mockFormSubmission = {
      "First Name": ["Hello"],
      "Last Name": ["World"],
    };

    const mockEvent = {
      sample: "event",
      namedValues: mockFormSubmission,
      range: {
        getRow() {},
      } as unknown as GoogleAppsScript.Spreadsheet.Range,
    } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

    // Act: Trigger event when form is submitted
    try {
      onFormSubmit(mockEvent);
    } catch (e) {}

    // Assertion: Logs error message if the sheet is undefined
    expect(global.Logger.log).toHaveBeenCalledWith(
      JSON.stringify(mockEvent.namedValues),
      {
        event: mockEvent,
      },
      sheetNotFoundError
    );
  });

  it("should get the range for the row above where the form data was submitted", () => {
    // Arrange: Set up mocks and their return values
    (
      MockSpreadsheetApp.mockActiveSpreadsheet
        .getSheetByName as jest.Mock<GoogleAppsScript.Spreadsheet.Sheet>
    ).mockImplementation(() => {
      return MockSpreadsheetApp.mockActiveSheet;
    });

    (
      MockPropertiesService.mockProperties.getProperty as jest.Mock<string>
    ).mockImplementation((a) => {
      return a === "UNIQUE_ID_COLUMN_NO" ? `${idColumnIndex}` : "";
    });

    // Arrange: Form submission event and spreadsheet cells of interest
    const currentRowIndex = 7;
    const previousRowIndex = 6;
    const idColumnIndex = 1;

    const mockEvent = {
      sample: "event",
      range: {
        getRow() {
          return currentRowIndex;
        },
      } as unknown as GoogleAppsScript.Spreadsheet.Range,
    } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

    // Act: Trigger event when form is submitted
    onFormSubmit(mockEvent);

    // Assertion: Finds the ID cell of the previous form submission in the sheet
    expect(MockSpreadsheetApp.mockActiveSheet.getRange).toHaveBeenCalledWith(
      previousRowIndex,
      1
    );
  });

  it("should get the value of the form ID for the previous form data entry", () => {
    // Arrange: Set up mocks and their return values
    (
      MockSpreadsheetApp.mockActiveSpreadsheet
        .getSheetByName as jest.Mock<GoogleAppsScript.Spreadsheet.Sheet>
    ).mockImplementation(() => {
      return MockSpreadsheetApp.mockActiveSheet;
    });

    (
      MockSpreadsheetApp.mockActiveSheet
        .getRange as jest.Mock<GoogleAppsScript.Spreadsheet.Range>
    ).mockImplementation(() => {
      return MockSpreadsheetApp.mockActiveRange;
    });

    // Arrange: Form submission event
    const mockEvent = {
      sample: "event",
      range: {
        getRow() {},
      } as unknown as GoogleAppsScript.Spreadsheet.Range,
    } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

    // Act: Trigger event when form is submitted
    onFormSubmit(mockEvent);

    // Assertion: Retrieves the value of the previous row's ID
    expect(MockSpreadsheetApp.mockActiveRange.getValue).toHaveBeenCalled();
  });

  it("should set a next value as the ID for the current form data entry", () => {
    // Arrange: Set up mocks and their return values
    (
      MockSpreadsheetApp.mockActiveSpreadsheet
        .getSheetByName as jest.Mock<GoogleAppsScript.Spreadsheet.Sheet>
    ).mockImplementation(() => {
      return MockSpreadsheetApp.mockActiveSheet;
    });

    (
      MockSpreadsheetApp.mockActiveSheet
        .getRange as jest.Mock<GoogleAppsScript.Spreadsheet.Range>
    ).mockImplementation(() => {
      return MockSpreadsheetApp.mockActiveRange;
    });

    (
      MockSpreadsheetApp.mockActiveRange.getValue as jest.Mock<number>
    ).mockImplementation(() => {
      return previousFormId;
    });

    // Arrange: Form submission event and spreadsheet cells of interest
    const currentRow = 11;
    const previousFormId = 99;

    const mockEvent = {
      sample: "event",
      range: {
        getRow() {
          return currentRow;
        },
      } as unknown as GoogleAppsScript.Spreadsheet.Range,
    } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

    // Act: Trigger event when form is submitted
    onFormSubmit(mockEvent);

    // Assertion: Generated ID for the form data is inserted into the spreadsheet
    expect(MockSpreadsheetApp.mockActiveRange.setValue).toHaveBeenCalledWith(
      100
    );
  });

  it("should send the form data with its ID to AWS for further processing", () => {
    // Arrange: Set up mocks and their return values
    (
      MockPropertiesService.mockProperties.getProperty as jest.Mock<string>
    ).mockImplementation((a) => {
      if (a === "REFFERALS_BUCKET_URL") {
        return "EXAMPLE_ENDPOINT";
      } else if (a === "REFFERALS_BUCKET_API_KEY") {
        return "EXAMPLE_API_KEY";
      } else {
        return "";
      }
    });

    (
      MockSpreadsheetApp.mockActiveSpreadsheet
        .getSheetByName as jest.Mock<GoogleAppsScript.Spreadsheet.Sheet>
    ).mockImplementation(() => {
      return MockSpreadsheetApp.mockActiveSheet;
    });

    (
      MockSpreadsheetApp.mockActiveSheet
        .getRange as jest.Mock<GoogleAppsScript.Spreadsheet.Range>
    ).mockImplementation(() => {
      return MockSpreadsheetApp.mockActiveRange;
    });

    (
      MockSpreadsheetApp.mockActiveRange.getValue as jest.Mock<number>
    ).mockImplementation(() => {
      return previousFormId;
    });

    (
      MockSpreadsheetApp.mockActiveRange
        .setValue as jest.Mock<GoogleAppsScript.Spreadsheet.Range>
    ).mockImplementation(() => {
      return MockSpreadsheetApp.mockActiveRange;
    });

    // Arrange: Form submission event, HTTP request options and updated form data with generated ID
    const previousFormId = 99;

    const mockFormSubmission = {
      "First Name": ["Hello"],
      "Last Name": ["World"],
    };

    const mockEvent = {
      sample: "event",
      namedValues: mockFormSubmission,
      range: {
        getRow() {},
      } as unknown as GoogleAppsScript.Spreadsheet.Range,
    } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

    var formDataWithId = mockEvent.namedValues;
    formDataWithId.FormSubmissionId = ["100"];

    var options = {
      method: "put",
      headers: { "X-API-KEY": "EXAMPLE_API_KEY" },
      contentType: "application/json",
      payload: JSON.stringify(formDataWithId),
    };

    // Act: Trigger event when form is submitted
    onFormSubmit(mockEvent);

    // Assertion: Form submission data including generated unique ID sent to AWS
    expect(global.UrlFetchApp.fetch).toHaveBeenCalledWith(
      `EXAMPLE_ENDPOINT/form-submissions/100`,
      options
    );
  });
});
