export class MockSpreadsheetApp {
  static mockActiveSpreadsheet = {
    getSheetByName: jest.fn(),
  } as unknown as GoogleAppsScript.Spreadsheet.Spreadsheet;

  static mockActiveSheet = {
    getRange: jest.fn(),
  } as unknown as GoogleAppsScript.Spreadsheet.Sheet;

  static mockActiveRange = {
    getValue: jest.fn(),
    setValue: jest.fn(),
  } as unknown as GoogleAppsScript.Spreadsheet.Range;

  getActiveSpreadsheet() {
    return MockSpreadsheetApp.mockActiveSpreadsheet;
  }
}
