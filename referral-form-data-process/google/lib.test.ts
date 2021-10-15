import { OAuth2Client } from "google-auth-library";
import { createDocumentFromTemplate } from "./lib";
import { google } from "googleapis";

const mockCopy = jest.fn()
const mockGet = jest.fn()
const mockBatchUpdate = jest.fn()
jest.mock('googleapis', () => ({
    google: {
        drive: jest.fn().mockImplementation(() => ({
            files: {
                copy: mockCopy
            }
        })),
        docs: jest.fn().mockImplementation(() => ({
            documents: {
                get: mockGet,
                batchUpdate: mockBatchUpdate
            }
        }))
    }
})
)

describe("#createDocumentFromTemplate", () => {
    const mockAuth = {
        credentials: {
            access_token: "actoken",
            refresh_token: "rtoken",
            scope: "https://www.googleapis.com/auth/drive.metadata.readonly",
            token_type: "Bearer",
            expiry_date: "1633950562052"
        }
    } as unknown as OAuth2Client

    const googleDocsVersion = "v1";
    const googleDriveVersion = "v3";
    const testTemplateDocumentId = "test-template-document-id";
    const newDocumentTitle = "test-new-document-title";
    const originalTemplateId = "1";
    const copyOfOriginalTemplateId = "2";
    const testInputData = { testKey: "testValue" };

    beforeEach(() => {
        mockCopy.mockReset();
        mockGet.mockReset();
        mockBatchUpdate.mockReset();

        mockCopy.mockImplementation(() => ({ data: { id: originalTemplateId } }))

        mockGet.mockImplementation(() => ({
            data: {
                documentId: copyOfOriginalTemplateId
            }
        }))
    })

    it("should call google drive", async () => {
        await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, testInputData)

        expect(google.drive).toBeCalledWith({ version: googleDriveVersion, auth: mockAuth })
    })

    it("should call google docs", async () => {
        await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, testInputData)

        expect(google.docs).toBeCalledWith({ version: googleDocsVersion, auth: mockAuth })
    })

    it("should call google drive's copy function with the correct parameters", async () => {
        await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, testInputData)

        expect(mockCopy).toBeCalledWith({ fileId: testTemplateDocumentId, requestBody: { name: newDocumentTitle } })
    })

    it("should thrown an exception when drive's copy function returns undefined data", async () => {
        mockCopy.mockImplementationOnce(() => ({ data: undefined }))

        try {
            await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, testInputData)
            fail('createDocumentFromTemplate should have thrown an exception')
        } catch (e: unknown) {
            if (e instanceof Error) {
                expect(e.message).toBe("Unable to duplicate template file");
            } else {
                fail('exception should be instance of Error')
            }
        }
    })

    it("should thrown an exception when drive's copy function returns data with a null id", async () => {
        mockCopy.mockImplementationOnce(() => ({ data: { id: null } }))

        try {
            await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, testInputData)
            fail('createDocumentFromTemplate should have thrown an exception')
        } catch (e: unknown) {
            if (e instanceof Error) {
                expect(e.message).toBe("Unable to duplicate template file");
            } else {
                fail('exception should be instance of Error')
            }
        }
    })

    it("should thrown an exception when drive's copy function returns data with an undefined id", async () => {
        mockCopy.mockImplementationOnce(() => ({ data: { id: undefined } }))

        try {
            await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, testInputData)
            fail('createDocumentFromTemplate should have thrown an exception')
        } catch (e: unknown) {
            if (e instanceof Error) {
                expect(e.message).toBe("Unable to duplicate template file");
            } else {
                fail('exception should be instance of Error')
            }
        }
    })

    it("should thrown an exception when drive's copy function returns data with an empty string as the id", async () => {
        mockCopy.mockImplementationOnce(() => ({ data: { id: "" } }))

        try {
            await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, testInputData)
            fail('createDocumentFromTemplate should have thrown an exception')
        } catch (e: unknown) {
            if (e instanceof Error) {
                expect(e.message).toBe("Unable to duplicate template file");
            } else {
                fail('exception should be instance of Error')
            }
        }
    })

    it("should call google document's get function with the correct parameters", async () => {
        await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, testInputData)

        expect(mockGet).toBeCalledWith({ documentId: originalTemplateId })
    })

    it("should thrown an exception when document's get function returns undefined data", async () => {
        mockGet.mockImplementationOnce(() => ({ data: undefined }))

        try {
            await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, testInputData)
            fail('createDocumentFromTemplate should have thrown an exception')
        } catch (e: unknown) {
            if (e instanceof Error) {
                expect(e.message).toBe("Unable to find new document");
            } else {
                fail('exception should be instance of Error')
            }
        }
    })

    it("should thrown an exception when document's get function returns data with a null document id", async () => {
        mockGet.mockImplementationOnce(() => ({ data: { documentId: null } }))

        try {
            await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, testInputData)
            fail('createDocumentFromTemplate should have thrown an exception')
        } catch (e: unknown) {
            if (e instanceof Error) {
                expect(e.message).toBe("Unable to find new document");
            } else {
                fail('exception should be instance of Error')
            }
        }
    })

    it("should thrown an exception when document's get function returns data with an undefined document id", async () => {
        mockGet.mockImplementationOnce(() => ({ data: { documentId: undefined } }))

        try {
            await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, testInputData)
            fail('createDocumentFromTemplate should have thrown an exception')
        } catch (e: unknown) {
            if (e instanceof Error) {
                expect(e.message).toBe("Unable to find new document");
            } else {
                fail('exception should be instance of Error')
            }
        }
    })

    it("should thrown an exception when document's get function returns data with an empty string as the document id", async () => {
        mockGet.mockImplementationOnce(() => ({ data: { documentId: "" } }))

        try {
            await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, testInputData)
            fail('createDocumentFromTemplate should have thrown an exception')
        } catch (e: unknown) {
            if (e instanceof Error) {
                expect(e.message).toBe("Unable to find new document");
            } else {
                fail('exception should be instance of Error')
            }
        }
    })

    it("should call google document's batch update with the correct parameters", async () => {
        await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, testInputData)

        expect(mockBatchUpdate).toBeCalledWith({ documentId: copyOfOriginalTemplateId, requestBody: { requests: [{ replaceAllText: { containsText: { matchCase: true, text: "{{testKey}}" }, replaceText: "testValue" } }] } })
    })

    it("should provide an empty array if no value is provided for an associated key", async () => {
        const inputData = { testKey: "" }
        await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, inputData)

        expect(mockBatchUpdate).toBeCalledWith({ documentId: copyOfOriginalTemplateId, requestBody: { requests: [] } })
    })

    it("should call google document's get function with the correct parameters after updating the document", async () => {
        await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, testInputData)

        expect(mockGet).toBeCalledWith({ documentId: copyOfOriginalTemplateId })
    })

    it("should return the new document from google after we apply batchUpdate", async () => {
        //This test focuses on testing what the google docs API is returning even though the test is essentially testing the mocks we created.
        //The value of the test is that we do return the updated document from the template
        const response = await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, testInputData)

        expect(response).toEqual({
            documentId: copyOfOriginalTemplateId
        })
    })
}
)