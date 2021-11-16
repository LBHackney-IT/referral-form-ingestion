import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { addGoogleDocUrlToSheet } from "./addGoogleDocUrlToSheet";

const mockGet = jest.fn();
const mockUpdate = jest.fn();

jest.mock("googleapis");

describe.only("#addGoogleDocUrlToSheet", () => {
    const mockAuth = {
        credentials: {
            access_token: "actoken",
            refresh_token: "rtoken",
            scope: "https://www.googleapis.com/auth/drive.metadata.readonly",
            token_type: "Bearer",
            expiry_date: "1633950562052",
        },
    } as unknown as OAuth2Client;

    const testDocumentUrl = "test-document-url";
    const testColumnUrl = "test-column-url";
    const testTableRow = "test-table-row";
    const testSpreadsheetId = "test-spreadsheet-id";
    const googleSheetVersion = "v4";

    beforeEach(() => {
        (google.sheets as jest.Mock).mockImplementation(() => ({
            spreadsheets: {
                get: mockGet,
                values: {
                    update: mockUpdate,
                },
            },
        }));

        mockGet.mockImplementation(() => ({
            data: {
                spreadsheetId: testSpreadsheetId,
            },
        }));
    });

    it("should call to sheets with our auth token", async () => {
        await addGoogleDocUrlToSheet(
            mockAuth,
            testDocumentUrl,
            testColumnUrl,
            testTableRow
        );

        expect(google.sheets).toBeCalledWith({
            version: googleSheetVersion,
            auth: mockAuth,
        });
    });

    it("should throw an error if sheet is undefined", async () => {
        mockGet.mockImplementation(() => ({
            data: undefined,
        }));

        try {
            await addGoogleDocUrlToSheet(
                mockAuth,
                testDocumentUrl,
                testColumnUrl,
                testTableRow
            );
            fail("addGoogleDocUrlToSheet should have thrown an exception");
        } catch (e: unknown) {
            if (e instanceof Error) {
                expect(e.message).toBe("Unable to fetch sheet based on provided ID");
            } else {
                fail("exception should be instance of Error");
            }
        }
    });

    it("should throw an error if spreadsheetId is an empty string", async () => {
        mockGet.mockImplementation(() => ({
            data: {
                spreadsheetId: "",
            },
        }));

        try {
            await addGoogleDocUrlToSheet(
                mockAuth,
                testDocumentUrl,
                testColumnUrl,
                testTableRow
            );
            fail("addGoogleDocUrlToSheet should have thrown an exception");
        } catch (e: unknown) {
            if (e instanceof Error) {
                expect(e.message).toBe("Unable to fetch sheet based on provided ID");
            } else {
                fail("exception should be instance of Error");
            }
        }
    });

    it("should throw an error if spreadsheetId is undefined", async () => {
        mockGet.mockImplementation(() => ({
            data: {
                spreadsheetId: undefined,
            },
        }));

        try {
            await addGoogleDocUrlToSheet(
                mockAuth,
                testDocumentUrl,
                testColumnUrl,
                testTableRow
            );
            fail("addGoogleDocUrlToSheet should have thrown an exception");
        } catch (e: unknown) {
            if (e instanceof Error) {
                expect(e.message).toBe("Unable to fetch sheet based on provided ID");
            } else {
                fail("exception should be instance of Error");
            }
        }
    });

    it("should throw an error if spreadsheetId is null", async () => {
        mockGet.mockImplementation(() => ({
            data: {
                spreadsheetId: null,
            },
        }));

        try {
            await addGoogleDocUrlToSheet(
                mockAuth,
                testDocumentUrl,
                testColumnUrl,
                testTableRow
            );
            fail("addGoogleDocUrlToSheet should have thrown an exception");
        } catch (e: unknown) {
            if (e instanceof Error) {
                expect(e.message).toBe("Unable to fetch sheet based on provided ID");
            } else {
                fail("exception should be instance of Error");
            }
        }
    });

    it("should call to update the spreadsheet values", async () => {
        await addGoogleDocUrlToSheet(
            mockAuth,
            testDocumentUrl,
            testColumnUrl,
            testTableRow
        );

        expect(mockUpdate).toBeCalledWith({
            range: `${testColumnUrl}${testTableRow}`,
            requestBody: {
                range: `${testColumnUrl}${testTableRow}`,
                values: [["test-document-url"]],
            },
            spreadsheetId: testSpreadsheetId,
            valueInputOption: "USER_ENTERED",
        });
    });
});