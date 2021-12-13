export const mapFormDataToFormDataAnswersObject = (
  formData: Record<string, string[]>
) => {
  const formDataAnswersObject: FormDataAnswersObject = {
    referrerFirstName: undefined,
    referrerLastName: undefined,
    clientOneFirstName: undefined,
    clientOneLastName: undefined,
    clientTwoFirstName: undefined,
    clientTwoLastName: undefined,
    clientThreeFirstName: undefined,
    clientThreeLastName: undefined,
    clientFourFirstName: undefined,
    clientFourLastName: undefined,
    clientFiveFirstName: undefined,
    clientFiveLastName: undefined,
    clientSixFirstName: undefined,
    clientSixLastName: undefined,
    clientSevenFirstName: undefined,
    clientSevenLastName: undefined,
    clientEightFirstName: undefined,
    clientEightLastName: undefined,
    requestedSupport: undefined,
  };

  const formQuestionToPropertyMap = new Map([
    ["Referrer First Name", "referrerFirstName"],
    ["Referrer Last Name", "referrerLastName"],
    ["Child 1: Child's First Name", "clientOneFirstName"],
    ["Child 1: Child's Last Name", "clientOneLastName"],
    ["Child 2: Child's First Name", "clientTwoFirstName"],
    ["Child 2: Child's Last Name", "clientTwoLastName"],
    ["Child 3: Child's First Name", "clientThreeFirstName"],
    ["Child 3: Child's Last Name", "clientThreeLastName"],
    ["Child 4: Child's First Name", "clientFourFirstName"],
    ["Child 4: Child's Last Name", "clientFourLastName"],
    ["Child 5: Child's First Name", "clientFiveFirstName"],
    ["Child 5: Child's Last Name", "clientFiveLastName"],
    ["Child 6: Child's First Name", "clientSixFirstName"],
    ["Child 6: Child's Last Name", "clientSixLastName"],
    ["Child 7: Child's First Name", "clientSevenFirstName"],
    ["Child 7: Child's Last Name", "clientSevenLastName"],
    ["Child 8: Child's First Name", "clientEightFirstName"],
    ["Child 8: Child's Last Name", "clientEightLastName"],
    [
      "What support do you think the child(ren) would benefit from?",
      "requestedSupport",
    ],
  ]);

  const dataEntries = Object.entries(formData);

  for (const [key, value] of dataEntries) {
    if (formQuestionToPropertyMap.has(key)) {
      formDataAnswersObject[
        formQuestionToPropertyMap.get(key) as keyof FormDataAnswersObject
      ] = value.toString();
    }
  }

  return formDataAnswersObject;
};
