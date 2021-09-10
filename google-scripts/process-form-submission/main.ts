export function onFormSubmit(
  event: GoogleAppsScript.Events.SheetsOnFormSubmit
) {
  const REFERRALS_SHEET_NAME =
    PropertiesService.getScriptProperties().getProperty("MASH_SHEET_NAME");

  const S3_ENDPOINT_API = PropertiesService.getScriptProperties().getProperty(
    "REFFERALS_BUCKET_URL"
  );
  const S3_ENDPOINT_API_KEY =
    PropertiesService.getScriptProperties().getProperty(
      "REFFERALS_BUCKET_API_KEY"
    );

  const FORM_SUBMISSION_ID_COLUMN_POSITION = Number(
    PropertiesService.getScriptProperties().getProperty("UNIQUE_ID_COLUMN_NO")
  );

  var formData = event.namedValues;

  try {
    var referralsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      `${REFERRALS_SHEET_NAME}`
    );
    var currentUniqueId = setUniqueIdOnSubmission(referralsSheet);

    // Update object to contain its ID
    formData.FormSubmissionId = [`${currentUniqueId}`];

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
      `${S3_ENDPOINT_API}/form-submissions/${currentUniqueId}`,
      options
    );
  }

  function setUniqueIdOnSubmission(
    activeSheet: GoogleAppsScript.Spreadsheet.Sheet | null | undefined
  ): number {
    if (activeSheet === undefined || activeSheet === null) {
      throw new Error("Sheet by name method returned null or undefined");
    } else {
      var currentFormDataRange = event.range;
      var previousSubmissionRowPosition = currentFormDataRange.getRow() - 1;
      var previousSubmissionIdCell = activeSheet.getRange(
        previousSubmissionRowPosition,
        FORM_SUBMISSION_ID_COLUMN_POSITION
      );

      var previousSubmissionUniqueId: number =
        previousSubmissionIdCell.getValue();
      var currentSubmissionUniqueId = previousSubmissionUniqueId + 1;

      var currentFormIdCell = activeSheet.getRange(
        currentFormDataRange.getRow(),
        FORM_SUBMISSION_ID_COLUMN_POSITION
      );
      currentFormIdCell.setValue(currentSubmissionUniqueId);
      return currentSubmissionUniqueId;
    }
  }
}
