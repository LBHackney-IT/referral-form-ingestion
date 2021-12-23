import { createMashReferralRequestObject } from "./helpers/createMashReferralRequestObject";

export const generateGoogleDocumentTitle = (
  formData: Record<string, string[]>
) => {
  const service = "MASH";

  const referralObject = createMashReferralRequestObject(formData);

  const clientOneFullName = `${referralObject.mashResidents[0].firstName} ${referralObject.mashResidents[0].lastName}`;

  const numberOfOtherClientsInReferral =
    referralObject.mashResidents.length - 1;

  if (numberOfOtherClientsInReferral > 0) {
    return `${clientOneFullName} +${numberOfOtherClientsInReferral} | ${service}`;
  }

  return `${clientOneFullName} | ${service}`;
};
