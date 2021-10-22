/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
};

process.env = Object.assign(process.env, {
  CLIENT_EMAIL: "test-client-email",
  PRIVATE_KEY: "test-private-key",
  URL_COLUMN: "test-url-column",
  TEMPLATE_DOCUMENT_ID: "test-template-document-id",
});
