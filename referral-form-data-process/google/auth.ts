import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/documents",
];

export const generateAuth = async (clientEmail: string, privateKey: string) => {
  const auth = new google.auth.JWT(clientEmail, undefined, privateKey, SCOPES);
  await auth.authorize();
  return auth;
};
