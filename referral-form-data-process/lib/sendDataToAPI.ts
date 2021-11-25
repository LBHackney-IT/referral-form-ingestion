import axios from "axios";

interface FormDataAnswersObject {
  referrerFirstName: string | undefined;
  referrerLastName: string | undefined;
  requestedSupport: string | undefined;
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
}

export const sendDataToAPI = async (
  formData: Record<string, string[]>,
  documentURL: string
) => {
  const ENDPOINT_API = process.env.ENDPOINT_API as string;
  const AWS_KEY = process.env.AWS_KEY as string;
  const headers = { "x-api-key": AWS_KEY };
  let formDataAnswersObject: FormDataAnswersObject = {
    referrerFirstName: undefined,
    referrerLastName: undefined,
    requestedSupport: undefined,
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
  };
  let clientsValue: string[] | undefined = [];

  const dataEntries = Object.entries(formData);
  for (const [key, value] of dataEntries) {
    if (key === "Referrer First Name") {
      formDataAnswersObject.referrerFirstName = value.toString();
    }
    if (key === "Referrer Last Name") {
      formDataAnswersObject.referrerLastName = value.toString();
    }
    if (
      key === "What support do you think the child(ren) would benefit from?"
    ) {
      formDataAnswersObject.requestedSupport = value.toString();
    }
    if (key === "Child 1: Child's First Name") {
      formDataAnswersObject.clientOneFirstName = value.toString();
    }
    if (key === "Child 1: Child's Last Name") {
      formDataAnswersObject.clientOneLastName = value.toString();
    }
    if (key === "Child 2: Child's First Name") {
      formDataAnswersObject.clientTwoFirstName = value.toString();
    }
    if (key === "Child 2: Child's Last Name") {
      formDataAnswersObject.clientTwoLastName = value.toString();
    }
    if (key === "Child 3: Child's First Name") {
      formDataAnswersObject.clientThreeFirstName = value.toString();
    }
    if (key === "Child 3: Child's Last Name") {
      formDataAnswersObject.clientThreeLastName = value.toString();
    }
    if (key === "Child 4: Child's First Name") {
      formDataAnswersObject.clientFourFirstName = value.toString();
    }
    if (key === "Child 4: Child's Last Name") {
      formDataAnswersObject.clientFourLastName = value.toString();
    }
    if (key === "Child 5: Child's First Name") {
      formDataAnswersObject.clientFiveFirstName = value.toString();
    }
    if (key === "Child 5: Child's Last Name") {
      formDataAnswersObject.clientFiveLastName = value.toString();
    }
    if (key === "Child 6: Child's First Name") {
      formDataAnswersObject.clientSixFirstName = value.toString();
    }
    if (key === "Child 6: Child's Last Name") {
      formDataAnswersObject.clientSixLastName = value.toString();
    }
    if (key === "Child 7: Child's First Name") {
      formDataAnswersObject.clientSevenFirstName = value.toString();
    }
    if (key === "Child 7: Child's Last Name") {
      formDataAnswersObject.clientSevenLastName = value.toString();
    }
    if (key === "Child 8: Child's First Name") {
      formDataAnswersObject.clientEightFirstName = value.toString();
    }
    if (key === "Child 8: Child's Last Name") {
      formDataAnswersObject.clientEightLastName = value.toString();
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
