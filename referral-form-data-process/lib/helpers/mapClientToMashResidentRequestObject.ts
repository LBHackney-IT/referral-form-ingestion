import {
  ResidentFormDataObject,
  MashResidentRequest,
} from "../interfaces/residentFormData";

export const mapClientToMashResidentRequestObject = (
  formData: Record<string, string[]>
) => {
  let mashResidents: MashResidentRequest[] = [];
  const dataEntries = Object.entries(formData);

  const totalPossibleChildReferrals = 8;

  for (let order = 1; order <= totalPossibleChildReferrals; order++) {
    const ChildDetailQuestionMap =
      generateMapForChildDetailFormQuestions(order);

    const residentFormData: ResidentFormDataObject = {
      firstName: undefined,
      lastName: undefined,
      dateOfBirth: undefined,
      gender: undefined,
      ethnicity: undefined,
      firstLanguage: undefined,
      school: undefined,
      addressLineOne: undefined,
      addressLineTwo: undefined,
      addressLineThree: undefined,
      postcode: undefined,
    };

    for (const [key, value] of dataEntries) {
      if (ChildDetailQuestionMap.has(key.trim())) {
        residentFormData[
          ChildDetailQuestionMap.get(key.trim()) as keyof ResidentFormDataObject
        ] = value.toString();
      }
    }

    if (
      residentFormData.firstName == undefined &&
      residentFormData.lastName == undefined
    ) {
      continue;
    }

    const dateOfBirth = residentFormData.dateOfBirth;
    residentFormData.dateOfBirth = formatDateToISO(dateOfBirth);

    const residentDetails = mapMashResidentDetailsToRequest(residentFormData);
    mashResidents.push(residentDetails);
  }

  function generateMapForChildDetailFormQuestions(sequence: number) {
    return new Map([
      [`Child ${sequence}: Child's First Name`, "firstName"],
      [`Child ${sequence}: Child's Last Name`, "lastName"],
      [
        `Child ${sequence}: Child's date of birth or EDD for unborns`,
        "dateOfBirth",
      ],
      [
        `Child ${sequence}: Gender - Which of the following describes how the child thinks of themself?`,
        "gender",
      ],
      [`Child ${sequence}: Ethnicity`, "ethnicity"],
      [`Child ${sequence}: Language`, "firstLanguage"],
      [`Child ${sequence}: School`, "school"],
      [`Child ${sequence}: Home address line 1`, "addressLineOne"],
      [`Child ${sequence}: Home address line 2`, "addressLineTwo"],
      [`Child ${sequence}: Home address line 3`, "addressLineThree"],
      [`Child ${sequence}: Postcode`, "postcode"],
    ]);
  }

  function mapMashResidentDetailsToRequest(
    mashResident: ResidentFormDataObject
  ) {
    const mashResidentPostRequest: MashResidentRequest = {
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

    (mashResidentPostRequest.firstName = mashResident.firstName),
      (mashResidentPostRequest.lastName = mashResident.lastName),
      (mashResidentPostRequest.dateOfBirth = mashResident.dateOfBirth),
      (mashResidentPostRequest.gender = mashResident.gender),
      (mashResidentPostRequest.ethnicity = mashResident.ethnicity),
      (mashResidentPostRequest.firstLanguage = mashResident.firstLanguage),
      (mashResidentPostRequest.school = mashResident.school),
      (mashResidentPostRequest.address =
        !mashResident.addressLineOne &&
        !mashResident.addressLineTwo &&
        !mashResident.addressLineThree
          ? undefined
          : `${mashResident.addressLineOne} ${mashResident.addressLineTwo} ${mashResident.addressLineThree}`),
      (mashResidentPostRequest.postcode = mashResident.postcode);

    return mashResidentPostRequest;
  }

  function formatDateToISO(dateString: string | undefined) {
    //Google form saves the dates in the dd/mm/yyyy format, not ISO 8601
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

  return mashResidents;
};
