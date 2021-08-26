export function onFormSubmit(
  event: GoogleAppsScript.Events.SheetsOnFormSubmit
) {
  const REFERRALS_SHEET_NAME = "EXAMPLE_SHEET_NAME";
  var formData = JSON.stringify(event.namedValues);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      `${REFERRALS_SHEET_NAME}`
    );
    setUniqueIdOnSubmission(sheet);
  } catch (e) {
    Logger.log(
      formData,
      {
        event,
      },
      e
    );
  }

  function setUniqueIdOnSubmission(
    activeSheet: GoogleAppsScript.Spreadsheet.Sheet | null
  ): number {
    if (activeSheet === undefined || activeSheet === null) {
      throw new Error("Sheet by name method returned null or undefined");
    } else {
      const IdColumnPosition = 1;
      var currentFormDataRange = event.range;
      var previousRowPosition = currentFormDataRange.getRow() - 1;
      var previousRowRange = activeSheet.getRange(
        previousRowPosition,
        IdColumnPosition
      );

      var previousFormDataId: number = previousRowRange.getValue();
      var currentFormId = previousFormDataId + 1;

      var currentFormIdCell = activeSheet.getRange(
        currentFormDataRange.getRow(),
        IdColumnPosition
      );
      currentFormIdCell.setValue(currentFormId);
      return currentFormId;
    }
  }
}
