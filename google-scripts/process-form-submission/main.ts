export function onFormSubmit(
  event: GoogleAppsScript.Events.SheetsOnFormSubmit
) {
  Logger.log("Hello, world! (from circleci) [test only push on main]", {
    event,
  });
}

// export function addUniqueId(
//   event: GoogleAppsScript.Events.SheetsOnFormSubmit
// ): number {
//   // const IdColumnNumber = 1;
//   // var rowData = event.range;
//   // var previousRow = rowData.getRow() - 1;
//   // var previousRowId = SpreadsheetApp.getActiveSheet()
//   //   .getRange(previousRow, IdColumnNumber)
//   //   .getValue();
//   // var newRowId = previousRowId + 1;
//   // return newRowId;
// }
