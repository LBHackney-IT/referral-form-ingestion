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

  const { data: duplicateTemplateDocument } = await docs.documents.get({
    documentId: duplicatedFile.id,
  });

  if (!duplicateTemplateDocument || !duplicateTemplateDocument.documentId) {
    throw new Error("Unable to find new document");
  }
  const batchUpdateRequsts = [];
  for (let i = 0; i < Object.entries(inputData).length; i++) {
    const [key, value] = Object.entries(inputData)[i];
    if (!value.toString()) {
      continue
    }
    const updateRequestObject = {
      replaceAllText: {
        containsText: {
          text: `{{${key}}}`,
          matchCase: true,
        },
        replaceText: value.toString() || `{{${key}}}`,
      }
    }
    batchUpdateRequsts.push(updateRequestObject);
  }


  await docs.documents.batchUpdate({
    documentId: duplicateTemplateDocument.documentId,
    requestBody: {
      requests: batchUpdateRequsts,
    },
  });

  const { data: newDocument } = await docs.documents.get({
    documentId: duplicateTemplateDocument.documentId,
  });
  return newDocument;
};