export function generateMapForChildDetailFormQuestions(
  sequence: number
): Map<string, string> {
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
