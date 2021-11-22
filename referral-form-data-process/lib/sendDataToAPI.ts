import axios from "axios";

export const sendDataToAPI = async (
  formData: Record<string, string[]>,
  documentURL: string
) => {
  const ENDPOINT_API = process.env.ENDPOINT_API as string;
  const AWS_KEY = process.env.AWS_KEY as string;
  const headers = { "x-api-key": AWS_KEY };

  let referrerValue: string | undefined;
  let requestedSupportValue: string | undefined;
  let clientsValue: string[] | undefined;

  const dataEntries = Object.entries(formData);
  for (const [key, value] of dataEntries) {
    switch (key) {
      case "TEMP: Question for getting the referrer of the form":
        referrerValue = value.toString();
        break;
      case "TEMP: Question for getting the requested support":
        requestedSupportValue = value.toString();
        break;
      case "TEMP: Question for getting the people being referred":
        clientsValue = value;
        break;
    }
  }
  const postObject = {
    referrer: referrerValue,
    requestedSupport: requestedSupportValue,
    clients: clientsValue,
    referralUri: documentURL,
  };

  await axios.post(`${ENDPOINT_API}/mash-referral`, postObject, {
    headers: headers,
  });
};
