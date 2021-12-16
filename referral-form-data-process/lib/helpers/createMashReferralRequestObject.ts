import {
  ReferrerFormDataObject,
  ReferralRequestObject,
  ResidentFormDataObject,
  MashResidentDetails,
} from "../interfaces/referralData";
import { mapChildDetailAnswersToObject } from "./data-to-object-mappers/mapChildDetailAnswersToObject";
import { createMashResidentDetailsObject } from "./createMashResidentDetailsObject";
import { mapReferrerFormDataAnswersToObject } from "./data-to-object-mappers/mapReferrerFormDataAnswersToObject";

export const createMashReferralRequestObject = (
  formData: Record<string, string[]>
) => {
  const dataEntries = Object.entries(formData);

  const totalPossibleChildReferralsInOneForm = 8;

  const mashResidents: MashResidentDetails[] = [];

  const request: ReferralRequestObject = {
    referrer: "",
    requestedSupport: "",
    mashResidents: mashResidents,
  };

  //Get details of referrer and any other referral data
  const referrerFormDataAnswers: ReferrerFormDataObject =
    mapReferrerFormDataAnswersToObject(dataEntries);

  //Get details of each referred child in a submission. Maximum is currently 8.
  for (let i = 1; i <= totalPossibleChildReferralsInOneForm; i++) {
    const residentFormDataAnswers: ResidentFormDataObject =
      mapChildDetailAnswersToObject(i, dataEntries);

    //Skip if no more child information has been submitted
    if (
      residentFormDataAnswers.firstName == undefined &&
      residentFormDataAnswers.lastName == undefined
    ) {
      continue;
    }

    //Google form saves the dates in the dd/mm/yyyy format
    //Convert to yyyy-mm-dd i.e ISO 8601
    residentFormDataAnswers.dateOfBirth = formatDateToISO(
      residentFormDataAnswers.dateOfBirth
    );

    const residentDetails = createMashResidentDetailsObject(
      residentFormDataAnswers
    );
    mashResidents.push(residentDetails);
  }

  function formatDateToISO(dateString: string | undefined) {
    if (dateString === undefined) {
      return;
    }
    const splitDateElements = dateString.split("/");
    const day = splitDateElements[0];
    const month = splitDateElements[1];
    const year = splitDateElements[2];

    const newISODateString = `${year}-${month}-${day}`;
    return newISODateString;
  }

  request.referrer = `${referrerFormDataAnswers.referrerFirstName} ${referrerFormDataAnswers.referrerLastName}`;
  request.requestedSupport = referrerFormDataAnswers.requestedSupport;
  request.mashResidents = mashResidents;
  return request;
};
