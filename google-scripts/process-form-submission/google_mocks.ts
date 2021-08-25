export class MockSpreadsheetApp {
  static mockActiveSpreadsheet = {
    getSheetByName: jest.fn(),
  } as unknown as GoogleAppsScript.Spreadsheet.Spreadsheet;

  getActiveSpreadsheet() {
    return MockSpreadsheetApp.mockActiveSpreadsheet;
  }
}
