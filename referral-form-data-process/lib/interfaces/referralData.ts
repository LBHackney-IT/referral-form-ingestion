export interface ReferrerFormDataObject {
  referrerFirstName: string | undefined;
  referrerLastName: string | undefined;
  requestedSupport: string | undefined;
}

export interface ResidentFormDataObject {
  firstName: string | undefined;
  lastName: string | undefined;
  dateOfBirth: string | undefined;
  gender: string | undefined;
  ethnicity: string | undefined;
  firstLanguage: string | undefined;
  school: string | undefined;
  addressLineOne: string | undefined;
  addressLineTwo: string | undefined;
  addressLineThree: string | undefined;
  postcode: string | undefined;
}

export interface MashResidentDetails {
  firstName: string | undefined;
  lastName: string | undefined;
  dateOfBirth: string | undefined;
  gender: string | undefined;
  ethnicity: string | undefined;
  firstLanguage: string | undefined;
  school: string | undefined;
  address: string | undefined;
  postcode: string | undefined;
}

export interface ReferralRequestObject {
  referrer: string | undefined;
  requestedSupport: string | undefined;
  mashResidents: MashResidentDetails[];
}
