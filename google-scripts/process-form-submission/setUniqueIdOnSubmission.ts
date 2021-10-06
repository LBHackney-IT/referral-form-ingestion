export function setUniqueIdOnSubmission(
  activeSheet: GoogleAppsScript.Spreadsheet.Sheet | null,
  idColumn: string,
  event: GoogleAppsScript.Events.SheetsOnFormSubmit
): number {
  if (!activeSheet) {
    throw new Error("Sheet by name method returned null or undefined");
  }

  const currentFormDataRange = event.range;
  const previousSubmissionRowPosition = currentFormDataRange.getRow() - 1;
  const previousSubmissionIdCell = activeSheet.getRange(
    previousSubmissionRowPosition,
    Number(idColumn)
  );

  const previousSubmissionUniqueId = Number(
    previousSubmissionIdCell.getValue()
  );
  const currentSubmissionUniqueId = previousSubmissionUniqueId + 1;

  const currentFormIdCell = activeSheet.getRange(
    currentFormDataRange.getRow(),
    Number(idColumn)
  );
  currentFormIdCell.setValue(currentSubmissionUniqueId);

  return currentSubmissionUniqueId;
}
