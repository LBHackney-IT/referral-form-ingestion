import { OAuth2Client } from "google-auth-library";
import { createDocumentFromTemplate } from "./lib";
import { google }  from "googleapis";

jest.mock('googleapis', () => ({
    google: {
            drive: jest.fn().mockImplementation(() => ({
                files: {
                    copy: jest.fn().mockImplementation(() => ({
                        data: {
                            id: "1"
                        }
                    }))
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

    it("should call google drive", async () => {
        const mockGoogleApiDrive = google.drive as jest.Mock

        await createDocumentFromTemplate(mockAuth, "test", "title", { one: "one" })

        expect(mockGoogleApiDrive).toBeCalledWith({ version: "v3", auth: mockAuth })
    })

    it("should call google docs", async () => {
        const mockGoogleApiSheet = google.docs as jest.Mock

        await createDocumentFromTemplate(mockAuth, "test", "title", { one: "one" })

        expect(mockGoogleApiSheet).toBeCalledWith({ version: "v1", auth: mockAuth })
    })

    it("should call google drive's copy function with the correct parameters", async () => {
        // const mockGoogleApiDriveCopy = google.drive as unknown as jest.Mock<any>
        // createDocumentFromTemplate(mockAuth, "test", "title", { one: "one" })

        // expect(mockGoogleApiDriveCopy.files.copy).toBeCalledWith({})

        //we are trying to mocks docs to return an object which should have a documents property
        //which should have a get function
        //this is to test this function is called correctly
    })


}
)