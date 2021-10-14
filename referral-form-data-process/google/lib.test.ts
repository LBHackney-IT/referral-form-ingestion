import { OAuth2Client } from "google-auth-library";
import { createDocumentFromTemplate } from "./lib";
import { google }  from "googleapis";

const mockCopy = jest.fn()
const mockGet = jest.fn()
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
                    batchUpdate: jest.fn()
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

    beforeEach( () => {
        mockCopy.mockReset();

        mockCopy.mockImplementation(() => ({data: {id:"1"}}))    
        
        mockGet.mockImplementation(() => ({
            data: {
                documentId: "2"
            }
        }))           
    } )

    it("should call google drive", async () => {
        await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, { one: "one" })

        expect(google.drive).toBeCalledWith({ version: googleDriveVersion, auth: mockAuth })
    })

    it("should call google docs", async () => {
        await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, { one: "one" })

        expect(google.docs).toBeCalledWith({ version: googleDocsVersion, auth: mockAuth })
    })

    it("should call google drive's copy function with the correct parameters", async () => {
        await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, { one: "one" })

        expect(mockCopy).toBeCalledWith({fileId: testTemplateDocumentId, requestBody:{name: newDocumentTitle}})
    })

    it("should thrown an exception when drive's copy function returns undefined data", async () => {
        mockCopy.mockImplementationOnce(() => ({data: undefined}))

        try {
            await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, { one: "one" })
            fail('createDocumentFromTemplate should have thrown an exception')
        } catch(e: unknown) {
            if(e instanceof Error) {
                expect(e.message).toBe("Unable to duplicate template file");
            } else {
                fail('exception should be instance of Error')
            }
        }
    })

    it("should thrown an exception when drive's copy function returns data with a null id", async () => {
        mockCopy.mockImplementationOnce(() => ({data: {id: null}}))

        try {
            await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, { one: "one" })
            fail('createDocumentFromTemplate should have thrown an exception')
        } catch(e: unknown) {
            if(e instanceof Error) {
                expect(e.message).toBe("Unable to duplicate template file");
            } else {
                fail('exception should be instance of Error')
            }
        }
    })

    it("should thrown an exception when drive's copy function returns data with an undefined id", async () => {
        mockCopy.mockImplementationOnce(() => ({data: {id: undefined}}))

        try {
            await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, { one: "one" })
            fail('createDocumentFromTemplate should have thrown an exception')
        } catch(e: unknown) {
            if(e instanceof Error) {
                expect(e.message).toBe("Unable to duplicate template file");
            } else {
                fail('exception should be instance of Error')
            }
        }
    })

    it("should thrown an exception when drive's copy function returns data with an empty string as the id", async () => {
        mockCopy.mockImplementationOnce(() => ({data: {id: ""}}))

        try {
            await createDocumentFromTemplate(mockAuth, testTemplateDocumentId, newDocumentTitle, { one: "one" })
            fail('createDocumentFromTemplate should have thrown an exception')
        } catch(e: unknown) {
            if(e instanceof Error) {
                expect(e.message).toBe("Unable to duplicate template file");
            } else {
                fail('exception should be instance of Error')
            }
        }
    })

    it("should call google document's get function with the correct parameters", async () => {
        
    })

    it("should thrown an exception when document's get function returns undefined data", async () => {

    })

    it("should thrown an exception when document's get function returns data with a null id", async () => {
        
    })

    it("should thrown an exception when document's get function returns data with an undefined id", async () => {
        
    })

    it("should thrown an exception when document's get function returns data with an empty string as the id", async () => {
        
    })

    it("should call google document's batch update with the correct parameters", async () => {

    })

    it("should return the newly created document", async () => {

    })
}
)