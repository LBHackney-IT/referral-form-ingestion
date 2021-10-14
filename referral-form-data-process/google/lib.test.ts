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
        await createDocumentFromTemplate(mockAuth, "test", "title", { one: "one" })

        expect(google.drive).toBeCalledWith({ version: "v3", auth: mockAuth })
    })

    it("should call google docs", async () => {
        await createDocumentFromTemplate(mockAuth, "test", "title", { one: "one" })

        expect(google.docs).toBeCalledWith({ version: "v1", auth: mockAuth })
    })

    it("should call google drive's copy function with the correct parameters", async () => {
        const fileId ="test"
        const expName = "title"
        await createDocumentFromTemplate(mockAuth, fileId, "title", { one: "one" })

        expect(mockCopy).toBeCalledWith({fileId:fileId, requestBody:{name: expName}})
    })

    it("should thrown an exception when drive's copy function returns undefined data", async () => {

    })

    it("should thrown an exception when drive's copy function returns data with a null id", async () => {
        
    })

    it("should thrown an exception when drive's copy function returns data with an undefined id", async () => {
        
    })

    it("should thrown an exception when drive's copy function returns data with an empty string as the id", async () => {
        
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