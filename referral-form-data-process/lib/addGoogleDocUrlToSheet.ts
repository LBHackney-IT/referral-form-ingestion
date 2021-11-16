import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

export const addGoogleDocUrlToSheet = async (
    auth: OAuth2Client,
    documentURL: string,
    urlColumn: string,
    tableRow: string
) => {
    const sheets = google.sheets({
        version: "v4",
        auth,
    });

    const spreadsheetId = process.env.SPREADSHEET_ID as string;

    const { data: sheet } = await sheets.spreadsheets.get({
        spreadsheetId,
    });

    if (!sheet || !sheet.spreadsheetId) {
        throw new Error("Unable to fetch sheet based on provided ID");
    }

    await sheets.spreadsheets.values.update({
        spreadsheetId: sheet.spreadsheetId,
        range: `${urlColumn}${tableRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
            range: `${urlColumn}${tableRow}`,
            values: [[documentURL]],
        },
    });
};