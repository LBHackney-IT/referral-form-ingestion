import axios from "axios";
import { createListOfReferredClients } from "./helpers/createListOfReferredClients";
import { mapFormDataToFormDataAnswersObject } from "./helpers/mapFormDataToFormDataAnswersObject";

export const sendDataToAPI = async (
  formData: Record<string, string[]>,
  documentURL: string
) => {
  const ENDPOINT_API = process.env.ENDPOINT_API as string;
  const AWS_KEY = process.env.AWS_KEY as string;
  const headers = { "x-api-key": AWS_KEY };

  const formDataAnswersObject = mapFormDataToFormDataAnswersObject(formData);
  const clientsValue = createListOfReferredClients(formDataAnswersObject);

  const postObject = {
    referrer: `${formDataAnswersObject.referrerFirstName} ${formDataAnswersObject.referrerLastName}`,
    requestedSupport: formDataAnswersObject.requestedSupport,
    clients: clientsValue,
    referralUri: documentURL,
  };

  await axios.post(`${ENDPOINT_API}/api/v1/mash-referral`, postObject, {
    headers: headers,
  });
};
