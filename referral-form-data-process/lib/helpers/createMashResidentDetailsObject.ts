import {
  ResidentFormDataObject,
  MashResidentDetails,
} from "../interfaces/referralData";

export function createMashResidentDetailsObject(
  formData: ResidentFormDataObject
) {
  const mashResidentDetails: MashResidentDetails = {
    firstName: undefined,
    lastName: undefined,
    dateOfBirth: undefined,
    gender: undefined,
    ethnicity: undefined,
    firstLanguage: undefined,
    school: undefined,
    address: undefined,
    postcode: undefined,
  };

  (mashResidentDetails.firstName = formData.firstName),
    (mashResidentDetails.lastName = formData.lastName),
    (mashResidentDetails.dateOfBirth = formData.dateOfBirth),
    (mashResidentDetails.gender = formData.gender),
    (mashResidentDetails.ethnicity = formData.ethnicity),
    (mashResidentDetails.firstLanguage = formData.firstLanguage),
    (mashResidentDetails.school = formData.school),
    (mashResidentDetails.address = concatAddress(
      formData.addressLineOne,
      formData.addressLineTwo,
      formData.addressLineThree
    )),
    (mashResidentDetails.postcode = formData.postcode);

  function concatAddress(
    addressline1: string | undefined,
    addressline2: string | undefined,
    addressline3: string | undefined
  ) {
    if (!addressline1 && !addressline2 && !addressline3) {
      return undefined;
    } else {
      return `${addressline1} ${addressline2} ${addressline3}`;
    }
  }

  return mashResidentDetails;
}
