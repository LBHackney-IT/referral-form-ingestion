import axios from "axios";

interface FormDataAnswersObject {
  referrerFirstName: string | undefined;
  referrerLastName: string | undefined;
  clientOneFirstName: string | undefined;
  clientOneLastName: string | undefined;
  clientTwoFirstName: string | undefined;
  clientTwoLastName: string | undefined;
  clientThreeFirstName: string | undefined;
  clientThreeLastName: string | undefined;
  clientFourFirstName: string | undefined;
  clientFourLastName: string | undefined;
  clientFiveFirstName: string | undefined;
  clientFiveLastName: string | undefined;
  clientSixFirstName: string | undefined;
  clientSixLastName: string | undefined;
  clientSevenFirstName: string | undefined;
  clientSevenLastName: string | undefined;
  clientEightFirstName: string | undefined;
  clientEightLastName: string | undefined;
  requestedSupport: string | undefined;
}

export const sendDataToAPI = async (
  formData: Record<string, string[]>,
  documentURL: string
) => {
  const ENDPOINT_API = process.env.ENDPOINT_API as string;
  const AWS_KEY = process.env.AWS_KEY as string;
  const headers = { "x-api-key": AWS_KEY };
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
  const mappingOfQuestionsToProperties = new Map([
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
  let clientsValue: string[] | undefined = [];

  const dataEntries = Object.entries(formData);
  for (const [key, value] of dataEntries) {
    if (mappingOfQuestionsToProperties.has(key)) {
      formDataAnswersObject[
        mappingOfQuestionsToProperties.get(key) as keyof FormDataAnswersObject
      ] = value.toString();
    }
  }

  const clientOne = getClientFullName(
    formDataAnswersObject.clientOneFirstName,
    formDataAnswersObject.clientOneLastName
  );
  const clientTwo = getClientFullName(
    formDataAnswersObject.clientTwoFirstName,
    formDataAnswersObject.clientTwoLastName
  );
  const clientThree = getClientFullName(
    formDataAnswersObject.clientThreeFirstName,
    formDataAnswersObject.clientThreeLastName
  );
  const clientFour = getClientFullName(
    formDataAnswersObject.clientFourFirstName,
    formDataAnswersObject.clientFourLastName
  );
  const clientFive = getClientFullName(
    formDataAnswersObject.clientFiveFirstName,
    formDataAnswersObject.clientFiveLastName
  );
  const clientSix = getClientFullName(
    formDataAnswersObject.clientSixFirstName,
    formDataAnswersObject.clientSixLastName
  );
  const clientSeven = getClientFullName(
    formDataAnswersObject.clientSevenFirstName,
    formDataAnswersObject.clientSevenLastName
  );
  const clientEight = getClientFullName(
    formDataAnswersObject.clientEightFirstName,
    formDataAnswersObject.clientEightLastName
  );

  if (clientOne) {
    clientsValue.push(clientOne);
  }
  if (clientTwo) {
    clientsValue.push(clientTwo);
  }
  if (clientThree) {
    clientsValue.push(clientThree);
  }
  if (clientFour) {
    clientsValue.push(clientFour);
  }
  if (clientFive) {
    clientsValue.push(clientFive);
  }
  if (clientSix) {
    clientsValue.push(clientSix);
  }
  if (clientSeven) {
    clientsValue.push(clientSeven);
  }
  if (clientEight) {
    clientsValue.push(clientEight);
  }

  const postObject = {
    referrer: `${formDataAnswersObject.referrerFirstName} ${formDataAnswersObject.referrerLastName}`,
    requestedSupport: formDataAnswersObject.requestedSupport,
    clients: clientsValue,
    referralUri: documentURL,
  };

  await axios.post(`${ENDPOINT_API}/mash-referral`, postObject, {
    headers: headers,
  });
};

function getClientFullName(firstName?: string, lastName?: string) {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else return null;
}
