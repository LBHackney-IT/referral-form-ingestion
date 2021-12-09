export function getProperties() {
  const { getProperty, setProperty } = PropertiesService.getScriptProperties();

  /* The lines below are a skeleton to allow a developer to manually change the values of the properties required to let the script function correctly.
     In the Apps Script project these lines will have to be uncommented and the values will have to be replaced with the correct ones.
     This is because clasp will replace the entire script with the local code and the script is owned by the Drive it lives in which does not give us the ability to change the properties through the UI.
  */

  // setProperty("MASH_SHEET_NAME", "MASH_SHEET_VALUE")
  // setProperty("REFERRALS_BUCKET_URL", "REFERRALS_BUCKET_URL_VALUE")
  // setProperty("REFERRALS_BUCKET_API_KEY", "REFERRALS_BUCKET_API_KEY_VALUE")
  // setProperty("UNIQUE_ID_COLUMN_NO", "UNIQUE_ID_COLUMN_NO_VALUE")

  const REFERRALS_SHEET_NAME = getProperty("MASH_SHEET_NAME");
  const S3_ENDPOINT_API = getProperty("REFERRALS_BUCKET_URL");
  const S3_ENDPOINT_API_KEY = getProperty("REFERRALS_BUCKET_API_KEY");
  const FORM_SUBMISSION_ID_COLUMN_POSITION = getProperty("UNIQUE_ID_COLUMN_NO");

  if (!REFERRALS_SHEET_NAME) {
    throw new Error("Property MASH_SHEET_NAME could not be found");
  }
  if (!S3_ENDPOINT_API) {
    throw new Error("Property REFERRALS_BUCKET_URL could not be found");
  }
  if (!FORM_SUBMISSION_ID_COLUMN_POSITION) {
    throw new Error("Property UNIQUE_ID_COLUMN_NO could not be found");
  }
  if (!S3_ENDPOINT_API_KEY) {
    throw new Error("Property REFERRALS_BUCKET_API_KEY could not be found");
  }

  return {
    REFERRALS_SHEET_NAME,
    S3_ENDPOINT_API,
    S3_ENDPOINT_API_KEY,
    FORM_SUBMISSION_ID_COLUMN_POSITION,
  };
}
