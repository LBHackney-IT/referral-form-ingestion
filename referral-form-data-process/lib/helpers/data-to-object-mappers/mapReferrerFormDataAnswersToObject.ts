import { ReferrerFormDataObject } from "../../interfaces/referralData";
import { generateMapForReferrerRelatedFormQuestions } from "../question-to-map-generators/generateMapForReferrerRelatedFormQuestions";

export function mapReferrerFormDataAnswersToObject(
  dataEntries: [string, string[]][]
) {
  const referrerFormDataAnswers: ReferrerFormDataObject = {
    referrerFirstName: undefined,
    referrerLastName: undefined,
    requestedSupport: undefined,
  };

  const formQuestionToPropertyMap =
    generateMapForReferrerRelatedFormQuestions();

  for (const [key, value] of dataEntries) {
    if (formQuestionToPropertyMap.has(key)) {
      referrerFormDataAnswers[
        formQuestionToPropertyMap.get(key) as keyof ReferrerFormDataObject
      ] = value.toString();
    }
  }
  return referrerFormDataAnswers;
}
