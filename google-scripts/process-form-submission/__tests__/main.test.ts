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
  });

  it("should call the logger with the provided event", () => {
    const helloString =
      "Hello, world! (from circleci) [test only push on main]";

    const mockEvent = {
      sample: "event",
      namedValues: helloString,
      range: {
        getRow() {},
      } as unknown as GoogleAppsScript.Spreadsheet.Range,
    } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

    onFormSubmit(mockEvent);

    expect(global.Logger.log).toHaveBeenCalledWith(
      JSON.stringify("Hello, world! (from circleci) [test only push on main]"),
      {
        event: mockEvent,
      }
    );
  });

  it("should call the logger with the question names and values from the form submission", () => {
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

    onFormSubmit(mockEvent);

    expect(global.Logger.log).toHaveBeenCalledWith(
      JSON.stringify(mockEvent.namedValues),
      {
        event: mockEvent,
      }
    );
  });

  it("should get the sheet for the mash submissions", () => {
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

  it("should find the region of the sheet where the data was inserted", () => {
    (
      MockSpreadsheetApp.mockActiveSpreadsheet
        .getSheetByName as jest.Mock<GoogleAppsScript.Spreadsheet.Sheet>
    ).mockImplementationOnce(() => {
      return MockSpreadsheetApp.mockActiveSheet;
    });

    const currentRow = 7;
    const previousRow = 6;
    const formIdColumn = 1;

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
      formIdColumn
    );
  });
});
