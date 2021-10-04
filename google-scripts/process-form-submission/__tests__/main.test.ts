import {
  MockPropertiesService,
  MockSpreadsheetApp,
} from "../__mocks__/google_mocks";
import { onFormSubmit } from "../main";

describe("#onFormSubmit()", () => {

  let mockFormData:{[key:string]:string[]};

  let mockEvent:GoogleAppsScript.Events.SheetsOnFormSubmit;

  let testProperties: Map<string, string>;

  beforeEach(() => {
    jest.resetAllMocks();

    testProperties = new Map([
      ["MASH_SHEET_NAME", "EXAMPLE_SHEET_NAME"],
      ["REFFERALS_BUCKET_URL", "EXAMPLE_S3_URL"],
      ["UNIQUE_ID_COLUMN_NO", "1"],
      ["REFFERALS_BUCKET_API_KEY", "EXAMPLE_API_KEY"]
    ]);

    mockFormData = {
      "First Name": ["Hello"],
      "Last Name": ["World"],
    };
  
    mockEvent = {
      namedValues: mockFormData,
      range: {
        getRow() {},
      } as unknown as GoogleAppsScript.Spreadsheet.Range,
    } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

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

    (
      MockPropertiesService.mockProperties.getProperty as jest.Mock<string>
    ).mockImplementation((a) => {
      if(testProperties.has(a)) {
        return testProperties.get(a) as string;
      }
      return "";
    });
  });

  it("should raise an error if sheet name property is empty", () => {
    testProperties.set("MASH_SHEET_NAME", "")

    // Act: Trigger event when form is submitted
    onFormSubmit(mockEvent);

    // Assertion: Logs error message if the sheet is null
    expect(global.Logger.log).toHaveBeenCalledWith(JSON.stringify(mockFormData), {
      event: mockEvent,
    },"Property MASH_SHEET_NAME could not be found");
  });

  it("should raise an error if REFFERALS_BUCKET_URL property is empty", () => {
    testProperties.set("REFFERALS_BUCKET_URL", "")

    // Act: Trigger event when form is submitted
    onFormSubmit(mockEvent);

    // Assertion: Logs error message if the sheet is null
    expect(global.Logger.log).toHaveBeenCalledWith(JSON.stringify(mockFormData), {
      event: mockEvent,
    },"Property REFFERALS_BUCKET_URL could not be found");
  });

  it("should raise an error if UNIQUE_ID_COLUMN_NO property is empty", () => {
    testProperties.set("UNIQUE_ID_COLUMN_NO", "")

    // Act: Trigger event when form is submitted
    onFormSubmit(mockEvent);

    // Assertion: Logs error message if the sheet is null
    expect(global.Logger.log).toHaveBeenCalledWith(JSON.stringify(mockFormData), {
      event: mockEvent,
    },"Property UNIQUE_ID_COLUMN_NO could not be found");
  });

  it("should raise an error if REFFERALS_BUCKET_API_KEY property is empty", () => {
    testProperties.set("REFFERALS_BUCKET_API_KEY", "")

    // Act: Trigger event when form is submitted
    onFormSubmit(mockEvent);

    // Assertion: Logs error message if the sheet is null
    expect(global.Logger.log).toHaveBeenCalledWith(JSON.stringify(mockFormData), {
      event: mockEvent,
    },"Property REFFERALS_BUCKET_API_KEY could not be found");
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

    // Act: Trigger event when form is submitted
    onFormSubmit(mockEvent);

    // Assertion: Logs error message if the sheet is null
    expect(global.Logger.log).toHaveBeenCalledWith(JSON.stringify(mockEvent.namedValues), {
      event: mockEvent,
    }, "Sheet by name method returned null or undefined");
  });

  it("should log the form data, event & error message when an error occurs", () => {
    /* 
    Arrange: Set up mocks and their return values:
    When not explicitly set, the mocks will return undefined
    --------------------------------------------------------
    Arrange: Form submission event and error message
    */

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
      "Sheet by name method returned null or undefined"
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

    // Arrange: Form submission event and spreadsheet cells of interest
    const currentRowIndex = 7;
    const previousRowIndex = 6;

    mockEvent = {
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

    mockEvent = {
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
      `EXAMPLE_S3_URL/form-submissions/100`,
      options
    );
  });
});
