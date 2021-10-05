import { setUniqueIdOnSubmission } from "../setUniqueIdOnSubmission";
import { MockSpreadsheetApp } from "../__mocks__/google_mocks";

describe("#setUniqueIdOnSubmission", () => {
    let mockFormData: { [key: string]: string[] };

    let mockEvent: GoogleAppsScript.Events.SheetsOnFormSubmit;

    const idColumn = "1"

    beforeEach(() => {
        jest.resetAllMocks();

        mockFormData = {
            "First Name": ["Hello"],
            "Last Name": ["World"],
        };

        mockEvent = {
            namedValues: mockFormData,
            range: {
                getRow() { },
            } as unknown as GoogleAppsScript.Spreadsheet.Range,
        } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

        global.SpreadsheetApp =
            new MockSpreadsheetApp() as unknown as GoogleAppsScript.Spreadsheet.SpreadsheetApp;

        (
            MockSpreadsheetApp.mockActiveSpreadsheet
                .getSheetByName as jest.Mock<GoogleAppsScript.Spreadsheet.Sheet>
        ).mockImplementation(() => {
            return MockSpreadsheetApp.mockActiveSheet;
        });

        (
            MockSpreadsheetApp.mockActiveSheet
                .getRange as jest.Mock<GoogleAppsScript.Spreadsheet.Range>
        ).mockImplementation(() => {
            return MockSpreadsheetApp.mockActiveRange;
        });
    })

    it("should return the id for the newly added submission", () => {
        const currentRowIndex = 7;
        const previousFormId = 1;

        mockEvent = {
            range: {
                getRow() {
                    return currentRowIndex;
                },
            } as unknown as GoogleAppsScript.Spreadsheet.Range,
        } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

        (
            MockSpreadsheetApp.mockActiveRange.getValue as jest.Mock<number>
        ).mockImplementation(() => {
            return previousFormId;
        });

        const response = setUniqueIdOnSubmission(MockSpreadsheetApp.mockActiveSheet, idColumn, mockEvent)

        expect(response).toBe(2)
    })

    it("should throw an error if the active sheet is not found", () => {
        expect(() => setUniqueIdOnSubmission(null, idColumn, mockEvent)).toThrow(
            "Sheet by name method returned null or undefined"
        );
    });

    it("should get the range for the row above where the form data was submitted", () => {
        const currentRowIndex = 7;
        const previousRowIndex = 6;

        mockEvent = {
            range: {
                getRow() {
                    return currentRowIndex;
                },
            } as unknown as GoogleAppsScript.Spreadsheet.Range,
        } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

        setUniqueIdOnSubmission(MockSpreadsheetApp.mockActiveSheet, idColumn, mockEvent)

        expect(MockSpreadsheetApp.mockActiveSheet.getRange).toHaveBeenCalledWith(
            previousRowIndex,
            1
        );
    });

    it("should get the value of the form ID for the previous form data entry", () => {
        setUniqueIdOnSubmission(MockSpreadsheetApp.mockActiveSheet, idColumn, mockEvent);

        // Assertion: Retrieves the value of the previous row's ID
        expect(MockSpreadsheetApp.mockActiveRange.getValue).toHaveBeenCalled();
    });

    it("should set a next value as the ID for the current form data entry", () => {
        const currentRow = 11;
        const previousFormId = 1;

        (
            MockSpreadsheetApp.mockActiveRange.getValue as jest.Mock<number>
        ).mockImplementation(() => {
            return previousFormId;
        });


        mockEvent = {
            range: {
                getRow() {
                    return currentRow;
                },
            } as unknown as GoogleAppsScript.Spreadsheet.Range,
        } as unknown as GoogleAppsScript.Events.SheetsOnFormSubmit;

        setUniqueIdOnSubmission(MockSpreadsheetApp.mockActiveSheet, idColumn, mockEvent);

        expect(MockSpreadsheetApp.mockActiveRange.setValue).toHaveBeenCalledWith(
            2
        );
    });
})