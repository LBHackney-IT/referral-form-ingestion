import { createListOfReferredClients } from "./helpers/createListOfReferredClients";
import { mapFormDataToFormDataAnswersObject } from "./helpers/mapFormDataToFormDataAnswersObject";

export const generateDocTitle = (formData: Record<string, string[]>) => {
  const service = "MASH";
  const mappedDataObject = mapFormDataToFormDataAnswersObject(formData);
  const clientList = createListOfReferredClients(mappedDataObject);

  const clientOneFullName = clientList[0];

  const numberOfOtherClientsInReferral = clientList.length - 1;

  if (numberOfOtherClientsInReferral > 0) {
    return `${clientOneFullName} +${numberOfOtherClientsInReferral} | ${service}`;
  }

  return `${clientOneFullName} | ${service}`;
};
