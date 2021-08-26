const REFERRALS_SHEET_NAME = "EXAMPLE_SHEET_NAME";

export function onFormSubmit(
  event: GoogleAppsScript.Events.SheetsOnFormSubmit
) {
  var formData = JSON.stringify(event.namedValues);

  Logger.log(formData, {
    event,
  });

  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    `${REFERRALS_SHEET_NAME}`
  );
  // if (activeSheet != null) {
  const IdColumnPosition = 1;
  var currentFormDataRange = event.range;
  var previousRowPosition = currentFormDataRange.getRow() - 1;
  var previousRowRange = activeSheet?.getRange(
    previousRowPosition,
    IdColumnPosition
  );

  var previousFormDataId = previousRowRange?.getValue();
  //   var currentFormId = previousRowId + 1;

  //   activeSheet
  //     .getRange(currentFormDataRange.getRow(), IdColumnPosition)
  //     .setValue(currentFormId);
  // }
}
