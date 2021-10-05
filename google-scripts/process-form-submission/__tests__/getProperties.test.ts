import {getProperties} from "../getProperties";
import { MockPropertiesService } from "../__mocks__/google_mocks";

describe.only("#getProperties", () => {
  let testProperties: Map<string, string | null>;

  const MASH_SHEET_NAME = "EXAMPLE_SHEET_NAME";
  const REFERRALS_BUCKET_URL = "EXAMPLE_S3_URL";
  const UNIQUE_ID_COLUMN_NO = "1";
  const REFERRALS_BUCKET_API_KEY = "EXAMPLE_API_KEY";

  beforeEach(() => {
    testProperties = new Map([
      ["MASH_SHEET_NAME", MASH_SHEET_NAME],
      ["REFERRALS_BUCKET_URL", REFERRALS_BUCKET_URL],
      ["UNIQUE_ID_COLUMN_NO", UNIQUE_ID_COLUMN_NO],
      ["REFERRALS_BUCKET_API_KEY", REFERRALS_BUCKET_API_KEY],
    ]);

    (
      MockPropertiesService.mockProperties.getProperty as jest.Mock<string | null>
    ).mockImplementation((a) => {
      if (testProperties.has(a)) {
        return testProperties.get(a) as string | null;
      }
      return "";
    });

    global.PropertiesService =
      new MockPropertiesService() as unknown as GoogleAppsScript.Properties.PropertiesService;
  });

  it("should return an object containing our properties when validation passes", () => {
    expect(getProperties()).toEqual({
      FORM_SUBMISSION_ID_COLUMN_POSITION: UNIQUE_ID_COLUMN_NO,
      REFERRALS_SHEET_NAME: MASH_SHEET_NAME,
      S3_ENDPOINT_API: REFERRALS_BUCKET_URL,
      S3_ENDPOINT_API_KEY: REFERRALS_BUCKET_API_KEY,
    });
  });

  it("should raise an error if sheet name property is empty", () => {
    testProperties.set("MASH_SHEET_NAME", "");

    expect(getProperties).toThrow(
      "Property MASH_SHEET_NAME could not be found"
    );
  });

  it("should raise an error if REFERRALS_BUCKET_URL property is empty", () => {
    testProperties.set("REFERRALS_BUCKET_URL", "");

    expect(getProperties).toThrow(
      "Property REFERRALS_BUCKET_URL could not be found"
    );
  });

  it("should raise an error if UNIQUE_ID_COLUMN_NO property is empty", () => {
    testProperties.set("UNIQUE_ID_COLUMN_NO", "");

    expect(getProperties).toThrow(
      "Property UNIQUE_ID_COLUMN_NO could not be found"
    );
  });

  it("should raise an error if REFERRALS_BUCKET_API_KEY property is empty", () => {
    testProperties.set("REFERRALS_BUCKET_API_KEY", "");

    expect(getProperties).toThrow(
      "Property REFERRALS_BUCKET_API_KEY could not be found"
    );
  });

  it("should raise an error if sheet name property is null", () => {
    testProperties.set("MASH_SHEET_NAME", null);

    expect(getProperties).toThrow(
      "Property MASH_SHEET_NAME could not be found"
    );
  });

  it("should raise an error if REFERRALS_BUCKET_URL property is null", () => {
    testProperties.set("REFERRALS_BUCKET_URL", null);

    expect(getProperties).toThrow(
      "Property REFERRALS_BUCKET_URL could not be found"
    );
  });

  it("should raise an error if UNIQUE_ID_COLUMN_NO property is null", () => {
    testProperties.set("UNIQUE_ID_COLUMN_NO", null);

    expect(getProperties).toThrow(
      "Property UNIQUE_ID_COLUMN_NO could not be found"
    );
  });

  it("should raise an error if REFERRALS_BUCKET_API_KEY property is null", () => {
    testProperties.set("REFERRALS_BUCKET_API_KEY", null);

    expect(getProperties).toThrow(
      "Property REFERRALS_BUCKET_API_KEY could not be found"
    );
  });
});
