import { generateAuth } from "./auth";
import { google } from "googleapis"
import { JWT } from "google-auth-library";

const mockAuthorize = jest.fn().mockResolvedValue({});

jest.mock('googleapis');

(google.auth.JWT as unknown as jest.Mock).mockImplementation(() => ({
    authorize: mockAuthorize
}))

describe('#authorizeAndGenerateJWT', () => {

    const testClientEmail = "test-email@example.com";
    const testPrivateKey = "test-private-key-foo-bar";
    const expectedScopes = ["https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/documents"]

    let response: JWT;

    beforeAll(async () => {
        response = await generateAuth(testClientEmail, testPrivateKey);
    })

    it('should call to google to create a new JWT with our email, private key and scope', () => {
        expect(google.auth.JWT).toBeCalledWith(testClientEmail, undefined, testPrivateKey, expectedScopes);
    })

    it('should call to authorize our generated JWT', () => {
        expect(mockAuthorize).toBeCalledWith();
    })

    it('should return instantiated JWT object', () => {
        expect(response).toEqual({
            authorize: mockAuthorize
        })
    })
})
