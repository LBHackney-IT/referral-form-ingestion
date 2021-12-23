import axios from "axios";
import { createMashReferralRequestObject } from "./helpers/createMashReferralRequestObject";

export const sendDataToAPI = async (
  formData: Record<string, string[]>,
  documentURL: string
) => {
  const ENDPOINT_API = process.env.ENDPOINT_API as string;
  const AWS_KEY = process.env.AWS_KEY as string;
  const headers = { "x-api-key": AWS_KEY };

  const referralObject = createMashReferralRequestObject(formData);

  const postObject = {
    referrer: referralObject.referrer,
    requestedSupport: referralObject.requestedSupport,
    mashResidents: referralObject.mashResidents,
    referralUri: documentURL,
  };

  await axios.post(`${ENDPOINT_API}/api/v1/mash-referral`, postObject, {
    headers: headers,
  });
};
