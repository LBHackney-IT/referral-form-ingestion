import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export const createDocumentFromTemplate = async (
    auth: OAuth2Client,
    templateDocumentId: string,
    title: string,
    inputData: Record<string, string | number>
  ) => {
    const drive = google.drive({ version: "v3", auth });
    const docs = google.docs({
      version: "v1",
      auth,
    });
  
    const { data: duplicatedFile } = await drive.files.copy({
      fileId: templateDocumentId,
      requestBody: {
        name: title,
      },
    });
  
    if (!duplicatedFile || !duplicatedFile.id) {
      throw new Error("Unable to duplicate template file");
    }
  
    const { data: newDocument } = await docs.documents.get({
      documentId: duplicatedFile.id,
    });
  
    if (!newDocument || !newDocument.documentId) {
      throw new Error("Unable to find new document");
    }
  
    await docs.documents.batchUpdate({
      documentId: newDocument.documentId,
      requestBody: {
        requests: Object.entries(inputData).map(([key, value]) => ({
          replaceAllText: {
            containsText: {
              text: `{{${key}}}`,
              matchCase: true,
            },
            replaceText: value.toString() || `{{${key}}}`,
          },
        })),
      },
    });
  
    return newDocument;
  };