import { MockSpreadsheetApp } from "../google_mocks";
import { onFormSubmit } from "../main";

describe("#onFormSubmit()", () => {
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
  });

  it("should get the active sheet for storing the MASH referrals", () => {
    (
      MockSpreadsheetApp.mockActiveSpreadsheet
        .getSheetByName as jest.Mock<GoogleAppsScript.Spreadsheet.Sheet>
    ).mockImplementation(() => {
      return MockSpreadsheetApp.mockActiveSheet;
    });

    const mockEvent = {
      sample: "event",
      range: {
        getRow() {},
      } as unknown as GoogleAppsScript.Spreadsheet.Range,
    } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

    onFormSubmit(mockEvent);

    expect(
      MockSpreadsheetApp.mockActiveSpreadsheet.getSheetByName
    ).toHaveBeenCalledWith("EXAMPLE_SHEET_NAME");
  });

  it("should return an error if the active sheet is not found", () => {
    (
      MockSpreadsheetApp.mockActiveSpreadsheet.getSheetByName as jest.Mock<null>
    ).mockImplementation(() => {
      return null;
    });

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
      onFormSubmit(mockEvent);
    } catch (e) {
      expect(e).toEqual(sheetNotFoundError);
    }
  });

  it("should log the form data, event & error message when an error occurs", () => {
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

    try {
      onFormSubmit(mockEvent);
    } catch (e) {}

    expect(global.Logger.log).toHaveBeenCalledWith(
      JSON.stringify(mockEvent.namedValues),
      {
        event: mockEvent,
      },
      sheetNotFoundError
    );
  });

  it("should get the range for the row above where the form data was submitted", () => {
    (
      MockSpreadsheetApp.mockActiveSpreadsheet
        .getSheetByName as jest.Mock<GoogleAppsScript.Spreadsheet.Sheet>
    ).mockImplementation(() => {
      return MockSpreadsheetApp.mockActiveSheet;
    });

    const currentRow = 7;
    const previousRow = 6;
    const setFormIdColumn = 1;

    const mockEvent = {
      sample: "event",
      range: {
        getRow() {
          return currentRow;
        },
      } as unknown as GoogleAppsScript.Spreadsheet.Range,
    } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

    onFormSubmit(mockEvent);

    expect(MockSpreadsheetApp.mockActiveSheet.getRange).toHaveBeenCalledWith(
      previousRow,
      setFormIdColumn
    );
  });

  it("should get the value of the form ID for the previous form data entry", () => {
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

    const mockEvent = {
      sample: "event",
      range: {
        getRow() {},
      } as unknown as GoogleAppsScript.Spreadsheet.Range,
    } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

    onFormSubmit(mockEvent);

    expect(MockSpreadsheetApp.mockActiveRange.getValue).toHaveBeenCalled();
  });

  it("should set a next value as the ID for the current form data entry", () => {
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

    onFormSubmit(mockEvent);

    expect(MockSpreadsheetApp.mockActiveRange.setValue).toHaveBeenCalledWith(
      100
    );
  });

  it("should send the form data with its ID to AWS for further processing", () => {
    const mockFormSubmission = {
      "First Name": ["Hello"],
      "Last Name": ["World"],
    };

    const previousFormId = 99;

    const mockEvent = {
      sample: "event",
      namedValues: mockFormSubmission,
      range: {
        getRow() {},
      } as unknown as GoogleAppsScript.Spreadsheet.Range,
    } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

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

    onFormSubmit(mockEvent);

    var formDataWithId = mockEvent.namedValues;
    formDataWithId.FormSubmissionId = ["100"];

    var options = {
      method: "put",
      headers: { "X-API-KEY": "EXAMPLE_API_KEY" },
      contentType: "application/json",
      payload: JSON.stringify(formDataWithId),
    };

    expect(global.UrlFetchApp.fetch).toHaveBeenCalledWith(
      `EXAMPLE_ENDPOINT/form-submissions/100`,
      options
    );
  });
});
