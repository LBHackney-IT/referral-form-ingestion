import { OAuth2Client } from "google-auth-library";
import { createDocumentFromTemplate } from "./lib";
import { google } from "googleapis";

jest.mock("googleapis");

// we import google from googleapis
// google contains a class called drive which we create
// drive has a property files which has a function copy that we call
// we need to check copy is called with the right given parameters

// we need to make sure google.drive returns an object with a files property with a mocked copy function

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

    const mockCopy = jest.fn();
    // const mockGet = jest.fn();

    beforeEach(() => {
        (google.drive as jest.Mock).mockImplementation(() => {
            return {
                files: {
                    copy: mockCopy
                }
            }
        })

        // (google.docs as jest.Mock).mockImplementation(() => {
        //     return {
        //         documents: {
        //             get: mockGet
        //         }
        //     }
        // })

        mockCopy.mockImplementation(() => {
            return {
                data: {
                    id: "1"
                }
            }
        })

        // mockGet.mockImplementation(() => {
        //     return {
        //         data: {
        //             documentId: "1"
        //         }
        //     }
        // })
    })


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
    })


}
)