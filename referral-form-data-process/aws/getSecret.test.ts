import AWS from "aws-sdk";
import { callbackify } from "util";
import { getSecret } from "./getSecret";

const mockGetSecretValue = jest.fn();

jest.mock("aws-sdk", () => ({
  SecretsManager: jest.fn().mockImplementation(() => ({
    getSecretValue: mockGetSecretValue,
  })),
}));

describe("#getSecret", () => {
  const testSecretName = "test-secret-name";

  beforeEach(() => {
    mockGetSecretValue.mockReset();
  });

  it("should make a secret client for eu-west-2", () => {
    getSecret(testSecretName);

    expect(AWS.SecretsManager).toBeCalledWith({ region: "eu-west-2" });
  });

  it("should make a request to get the value of a secret for a given name", () => {
    getSecret(testSecretName);

    expect(mockGetSecretValue).toBeCalledWith(
      { SecretId: testSecretName },
      expect.any(Function)
    );
  });

  it("should return an empty string if no secret value is retrieved", () => {
    const response = getSecret(testSecretName);

    expect(response).toBe("");
  });
});
