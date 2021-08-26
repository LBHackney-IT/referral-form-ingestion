import axios from "axios";
const REFERRALS_SHEET_NAME = "EXAMPLE_SHEET_NAME";
const S3_ENDPOINT_API = "EXAMPLE_ENDPOINT";
const S3_ENDPOINT_API_KEY = "EXAMPLE_API_KEY";

export function onFormSubmit(
  event: GoogleAppsScript.Events.SheetsOnFormSubmit
) {
  var formData = JSON.stringify(event.namedValues);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
      `${REFERRALS_SHEET_NAME}`
    );
    var uniqueId = setUniqueIdOnSubmission(sheet);
    sendFormDataToS3(formData, uniqueId);
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

  async function sendFormDataToS3(
    formData: string,
    uniqueId: number
  ): Promise<void> {
    const apiKeyHeader = {
      "x-api-key": S3_ENDPOINT_API_KEY,
    };
    const { data } = await axios.patch(
      `${S3_ENDPOINT_API}/form-submissions/${uniqueId}`,
      {
        id: uniqueId,
        formData,
      },
      {
        headers: apiKeyHeader,
      }
    );
    return data;
  }
}
