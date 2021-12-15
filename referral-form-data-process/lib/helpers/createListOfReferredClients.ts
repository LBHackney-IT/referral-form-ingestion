import { FormDataAnswersObject } from "../interfaces/formDataAnswers";

export const createListOfReferredClients = (
  formDataAnswersObject: FormDataAnswersObject
) => {
  let clientsValue: string[] | undefined = [];

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

  function getClientFullName(firstName?: string, lastName?: string) {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else return null;
  }

  return clientsValue;
};
