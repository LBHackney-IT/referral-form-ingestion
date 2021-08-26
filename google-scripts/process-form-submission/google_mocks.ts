export class MockSpreadsheetApp {
  static mockActiveSpreadsheet = {
    getSheetByName: jest.fn(),
  } as unknown as GoogleAppsScript.Spreadsheet.Spreadsheet;

  static mockActiveSheet = {
    getRange: jest.fn(),
  } as unknown as GoogleAppsScript.Spreadsheet.Sheet;

  static mockPreviousRowRange = {
    getValue: jest.fn(),
  } as unknown as GoogleAppsScript.Spreadsheet.Range;

  getActiveSpreadsheet() {
    return MockSpreadsheetApp.mockActiveSpreadsheet;
  }
}

// export class MockSpreadsheetApp {
//   static mockActiveSpreadsheet = {
//     getSheetByName: jest.fn().mockReturnThis(),
//     getRange: jest.fn().mockReturnThis(),
//   } as unknown as GoogleAppsScript.Spreadsheet.Spreadsheet;

//   getActiveSpreadsheet() {
//     return MockSpreadsheetApp.mockActiveSpreadsheet;
//   }
// }

// export class MockSpreadsheetApp {
//   static mockActiveSheet = {
//     // hello: "hello",
//     getRange: jest.fn(),
//     // getRange: jest.fn(() => {
//     //   return MockSpreadsheetApp.mockActiveSheet;
//     // }),
//     // getValue: jest.fn().mockReturnThis,
//   } as unknown as GoogleAppsScript.Spreadsheet.Sheet;

//   static mockActiveSpreadsheet = {
//     getSheetByName: jest.fn(),
//     // getSheetByName() {
//     //   return MockSpreadsheetApp.mockActiveSheet;
//     // },
//     // getSheetByName() {
//     //   return MockSpreadsheetApp.mockActiveSheet;
//     // },
//     // getSheetByName: jest.fn(() => {
//     //   return MockSpreadsheetApp.mockActiveSheet;
//     // }),
//     // getRange: jest.fn(() => {
//     //   return MockSpreadsheetApp.mockActiveSpreadsheet;
//     // }),
//   } as unknown as GoogleAppsScript.Spreadsheet.Spreadsheet;

//   getActiveSpreadsheet() {
//     return MockSpreadsheetApp.mockActiveSpreadsheet;
//   }
// }

// export class MockSpreadsheetApp {
//   static mockActiveSpreadsheet = {
//     getSheetByName: jest.fn().mockReturnThis(),
//     getRange: jest.fn().mockReturnThis(),
//   } as unknown as GoogleAppsScript.Spreadsheet.Spreadsheet;

//   //   static mockActiveSheet = {
//   //     getRange: jest.fn(),
//   //   } as unknown as GoogleAppsScript.Spreadsheet.Sheet;

//   getActiveSpreadsheet() {
//     return MockSpreadsheetApp.mockActiveSpreadsheet;
//   }
// }
