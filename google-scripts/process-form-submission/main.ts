export function onFormSubmit(
  event: GoogleAppsScript.Events.SheetsOnFormSubmit
) {
  var formData = JSON.stringify(event.namedValues);

  Logger.log(formData, {
    event,
  });

  // const activeSheet =
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("MASH_submissions");
  // if (activeSheet != null) {
  //   const IdColumnPosition = 1;
  //   var currentFormDataRange = event.range;
  //   var previousRowPosition = currentFormDataRange.getRow() - 1;
  //   var previousRowId = activeSheet
  //     ?.getRange(previousRowPosition, IdColumnPosition)
  //     .getValue();
  //   var currentFormId = previousRowId + 1;

  //   activeSheet
  //     .getRange(currentFormDataRange.getRow(), IdColumnPosition)
  //     .setValue(currentFormId);
  // }
}
