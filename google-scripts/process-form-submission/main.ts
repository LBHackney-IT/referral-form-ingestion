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

    const currentUniqueSubmissionDetails = setUniqueIdOnSubmission(
      referralsSheet,
      FORM_SUBMISSION_ID_COLUMN_POSITION,
      event
    );

    const uniqueId = currentUniqueSubmissionDetails.id;
    const formRow = currentUniqueSubmissionDetails.row;
    // Update the form submission object to contain its unique ID
    formData.FormSubmissionId = [uniqueId.toString()];
    formData.FormRow = [formRow.toString()];
    // Send updated form submission object to AWS
    sendDataToS3(S3_ENDPOINT_API, S3_ENDPOINT_API_KEY, uniqueId);
  } catch (e: any) {
    Logger.log(
      JSON.stringify({
        timeStamp: generateISOTimestamp(formData.Timestamp),
        errorMessage: e.message,
      })
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

  function generateISOTimestamp(googleTimeStamp: string[]) {
    // google timestamp is in the format [dd/MM/yyyy HH:mm:ss]
    const [date, time] = googleTimeStamp[0].split(" ");

    const [day, month, year] = date.split("/").map(Number);
    const [hour, minute] = time.split(":").map(Number);

    // subtract 1 from the month because in JS months start at 0, January is 0, google timestamp has January as 1
    return new Date(year, month - 1, day, hour, minute).toISOString();
  }
}
