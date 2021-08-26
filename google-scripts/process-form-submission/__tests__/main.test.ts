import { MockSpreadsheetApp } from "../google_mocks";
import { onFormSubmit } from "../main";
import { when } from "jest-when";

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
    const REFERRALS_SHEET_NAME = process.env.REFERRALS_SHEET_NAME;

    const mockEvent = {
      sample: "event",
      range: {
        getRow() {},
      } as unknown as GoogleAppsScript.Spreadsheet.Range,
    } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

    onFormSubmit(mockEvent);

    expect(
      MockSpreadsheetApp.mockActiveSpreadsheet.getSheetByName
    ).toHaveBeenCalledWith(`${REFERRALS_SHEET_NAME}`);
  });

  it("should find the region of the sheet where the data was inserted", () => {
    const REFERRALS_SHEET_NAME = process.env.REFERRALS_SHEET_NAME;

    when(MockSpreadsheetApp.mockActiveSpreadsheet.getSheetByName)
      .calledWith(`${REFERRALS_SHEET_NAME}`)
      .mockReturnValue(MockSpreadsheetApp.mockActiveSheet);

    const mockEvent = {
      sample: "event",
      range: {
        getRow() {},
      } as unknown as GoogleAppsScript.Spreadsheet.Range,
    } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

    onFormSubmit(mockEvent);

    expect(MockSpreadsheetApp.mockActiveSheet.getRange).toHaveBeenCalled();
  });
});
