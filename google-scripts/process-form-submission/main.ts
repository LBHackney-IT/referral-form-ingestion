const REFERRALS_SHEET_NAME = "EXAMPLE_SHEET_NAME";
const S3_ENDPOINT_API = "EXAMPLE_ENDPOINT";
const S3_ENDPOINT_API_KEY = "EXAMPLE_API_KEY";

export function onFormSubmit(
  event: GoogleAppsScript.Events.SheetsOnFormSubmit
) {
  var formData = event.namedValues;
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      `${REFERRALS_SHEET_NAME}`
    );
    var uniqueId = setUniqueIdOnSubmission(sheet);
    // Update object to contain its ID
    formData.FormSubmissionId = [`${uniqueId}`];

    sendDataToS3();
  } catch (e) {
    Logger.log(
      JSON.stringify(formData),
      {
        event,
      },
      e
    );
  }

  function sendDataToS3() {
    var options = {
      method: "put",
      headers: { "X-API-KEY": `${S3_ENDPOINT_API_KEY}` },
      contentType: "application/json",
      payload: JSON.stringify(formData),
    } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
    UrlFetchApp.fetch(
      `${S3_ENDPOINT_API}/form-submissions/${uniqueId}`,
      options
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
