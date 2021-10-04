import {getProperties} from "./getProperties";
export function onFormSubmit(
  event: GoogleAppsScript.Events.SheetsOnFormSubmit
) {
  var formData = event.namedValues;

  try {
    const {
      REFERRALS_SHEET_NAME,
      S3_ENDPOINT_API,
      S3_ENDPOINT_API_KEY,
      FORM_SUBMISSION_ID_COLUMN_POSITION,
    } = getProperties();
    var referralsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      `${REFERRALS_SHEET_NAME}`
    );
    var currentUniqueId = setUniqueIdOnSubmission(
      referralsSheet,
      FORM_SUBMISSION_ID_COLUMN_POSITION
    );

    // Update the form submission object to contain its unique ID
    formData.FormSubmissionId = [`${currentUniqueId}`];

    // Send updated form submission object to AWS
    sendDataToS3(S3_ENDPOINT_API, S3_ENDPOINT_API_KEY);
  } catch (e: any) {
    Logger.log(
      JSON.stringify(formData),
      {
        event,
      },
      e.message
    );
  }

  function sendDataToS3(apiUrl: string, apiKey: string) {
    var options = {
      method: "put",
      headers: { "X-API-KEY": apiKey },
      contentType: "application/json",
      payload: JSON.stringify(formData),
    } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;

    UrlFetchApp.fetch(`${apiUrl}/form-submissions/${currentUniqueId}`, options);
  }

  function setUniqueIdOnSubmission(
    activeSheet: GoogleAppsScript.Spreadsheet.Sheet | null | undefined,
    idColumn: string
  ): number {
    if (activeSheet === undefined || activeSheet === null) {
      throw new Error("Sheet by name method returned null or undefined");
    } else {
      var currentFormDataRange = event.range;
      var previousSubmissionRowPosition = currentFormDataRange.getRow() - 1;
      var previousSubmissionIdCell = activeSheet.getRange(
        previousSubmissionRowPosition,
        Number(idColumn)
      );

      var previousSubmissionUniqueId: number =
        previousSubmissionIdCell.getValue();
      var currentSubmissionUniqueId = previousSubmissionUniqueId + 1;

      var currentFormIdCell = activeSheet.getRange(
        currentFormDataRange.getRow(),
        Number(idColumn)
      );
      currentFormIdCell.setValue(currentSubmissionUniqueId);
      return currentSubmissionUniqueId;
    }
  }
}
