export function getProperties() {
  const REFERRALS_SHEET_NAME =
    PropertiesService.getScriptProperties().getProperty("MASH_SHEET_NAME");

  const S3_ENDPOINT_API = PropertiesService.getScriptProperties().getProperty(
    "REFFERALS_BUCKET_URL"
  );
  const S3_ENDPOINT_API_KEY =
    PropertiesService.getScriptProperties().getProperty(
      "REFFERALS_BUCKET_API_KEY"
    );

  const FORM_SUBMISSION_ID_COLUMN_POSITION =
    PropertiesService.getScriptProperties().getProperty("UNIQUE_ID_COLUMN_NO");

  if (!REFERRALS_SHEET_NAME) {
    throw new Error("Property MASH_SHEET_NAME could not be found");
  }
  if (!S3_ENDPOINT_API) {
    throw new Error("Property REFFERALS_BUCKET_URL could not be found");
  }
  if (!FORM_SUBMISSION_ID_COLUMN_POSITION) {
    throw new Error("Property UNIQUE_ID_COLUMN_NO could not be found");
  }
  if (!S3_ENDPOINT_API_KEY) {
    throw new Error("Property REFFERALS_BUCKET_API_KEY could not be found");
  }

  return {
    REFERRALS_SHEET_NAME,
    S3_ENDPOINT_API,
    S3_ENDPOINT_API_KEY,
    FORM_SUBMISSION_ID_COLUMN_POSITION,
  };
}
