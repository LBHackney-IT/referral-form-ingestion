import { ResidentFormDataObject } from "../../interfaces/referralData";
import { generateMapForChildDetailFormQuestions } from "../question-to-map-generators/generateMapForChildDetailFormQuestions";

export function mapChildDetailAnswersToObject(
  iterator: number,
  dataEntries: [string, string[]][]
) {
  const ChildDetailQuestionMap =
    generateMapForChildDetailFormQuestions(iterator);

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

  return residentFormData;
}
