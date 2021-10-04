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
    if (!REFERRALS_SHEET_NAME){
      throw new Error("Property MASH_SHEET_NAME could not be found");
    }
    if (!S3_ENDPOINT_API) {
      throw new Error("Property REFFERALS_BUCKET_URL could not be found")
    }
    var referralsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      `${REFERRALS_SHEET_NAME}`
    );
    var currentUniqueId = setUniqueIdOnSubmission(referralsSheet);

    // Update the form submission object to contain its unique ID
    formData.FormSubmissionId = [`${currentUniqueId}`];

    // Send updated form submission object to AWS
    sendDataToS3();
  } catch (e: any) {
    Logger.log(
      JSON.stringify(formData),
      {
        event,
      },
      e.message
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
