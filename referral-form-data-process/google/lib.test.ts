import { OAuth2Client } from "google-auth-library";
import { createDocumentFromTemplate } from "./lib";
import { google }  from "googleapis";

const mockCopy = jest.fn()
jest.mock('googleapis', () => ({
    google: {
            drive: jest.fn().mockImplementation(() => ({
                files: {
                    copy: mockCopy
                }
            })),
            docs: jest.fn().mockImplementation(() => ({
                documents: {
                    get: jest.fn().mockImplementation(() => ({
                        data: {
                            documentId: "2"
                        }
                    })),
                    batchUpdate: jest.fn().mockImplementation(() => {})
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
    } )

    it("should call google drive", async () => {
        await createDocumentFromTemplate(mockAuth, "test", "title", { one: "one" })

        expect(google.drive).toBeCalledWith({ version: "v3", auth: mockAuth })
    })

    it("should call google docs", async () => {
        const mockGoogleApiSheet = google.docs as jest.Mock

        await createDocumentFromTemplate(mockAuth, "test", "title", { one: "one" })

        expect(mockGoogleApiSheet).toBeCalledWith({ version: "v1", auth: mockAuth })
    })

    it("should call google drive's copy function with the correct parameters", async () => {
        const fileId ="test"
        const expName = "title"
        await createDocumentFromTemplate(mockAuth, fileId, "title", { one: "one" })

        expect(mockCopy).toBeCalledWith({fileId:fileId, requestBody:{name: expName}})

    })


}
)