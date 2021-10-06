import { getProperties } from "./getProperties";
import { setUniqueIdOnSubmission } from "./setUniqueIdOnSubmission";

export function onFormSubmit(
  event: GoogleAppsScript.Events.SheetsOnFormSubmit
) {
  const formData = event.namedValues;

  try {
    const {
      REFERRALS_SHEET_NAME,
      S3_ENDPOINT_API,
      S3_ENDPOINT_API_KEY,
      FORM_SUBMISSION_ID_COLUMN_POSITION,
    } = getProperties();

    const referralsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      `${REFERRALS_SHEET_NAME}`
    );

    const currentUniqueId = setUniqueIdOnSubmission(
      referralsSheet,
      FORM_SUBMISSION_ID_COLUMN_POSITION,
      event
    );

    // Update the form submission object to contain its unique ID
    formData.FormSubmissionId = [currentUniqueId.toString()];

    // Send updated form submission object to AWS
    sendDataToS3(S3_ENDPOINT_API, S3_ENDPOINT_API_KEY, currentUniqueId);
  } catch (e: any) {
    Logger.log(
      JSON.stringify(formData),
      {
        event,
      },
      e.message
    );
  }

  function sendDataToS3(
    apiUrl: string,
    apiKey: string,
    currentUniqueId: number
  ) {
    const options = {
      method: "put",
      headers: { "X-API-KEY": apiKey },
      contentType: "application/json",
      payload: JSON.stringify(formData),
    } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;

    UrlFetchApp.fetch(`${apiUrl}/form-submissions/${currentUniqueId}`, options);
  }
}
