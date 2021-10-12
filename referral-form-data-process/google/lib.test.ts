import { OAuth2Client } from "google-auth-library";
import { createDocumentFromTemplate } from "./lib";
import { drive_v3, google } from "googleapis";

jest.mock("googleapis", () => ({ files: { copy: jest.fn() } }))

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

    it("should call google drive", () => {
        const mockGoogleApiDrive = google.drive as jest.Mock

        createDocumentFromTemplate(mockAuth, "test", "title", { one: "one" })

        expect(mockGoogleApiDrive).toBeCalledWith({ version: "v3", auth: mockAuth })
    })

    it("should call google docs", () => {
        const mockGoogleApiSheet = google.docs as jest.Mock

        createDocumentFromTemplate(mockAuth, "test", "title", { one: "one" })

        expect(mockGoogleApiSheet).toBeCalledWith({ version: "v1", auth: mockAuth })
    })

    it("should call google drive's copy function with the correct parameters", () => {
        const mockGoogleApiDriveCopy = google.drive as unknown as jest.Mock<any>
        createDocumentFromTemplate(mockAuth, "test", "title", { one: "one" })

        expect(mockGoogleApiDriveCopy.files.copy).toBeCalledWith({})
    })


}
)