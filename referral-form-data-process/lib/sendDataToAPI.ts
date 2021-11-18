import axios from "axios";
interface PostRequest {
    referrer: string;
    requestedSupport: string;
    clients: string[];
    referralUri: string;
}

export const sendDataToAPI = async (
    formData: Record<string, string[]>,
    documentURL: string
) => {
    const ENDPOINT_API = process.env.ENDPOINT_API as string;
    const AWS_KEY = process.env.AWS_KEY as string;
    const headers = { "x-api-key": AWS_KEY };

    const batchPostRequests: PostRequest[] = [];
    let referrerValue: string = "";
    let requestedSupportValue: string = "";
    let clientsValue: string[] = [];

    const dataEntries = Object.entries(formData);
    for (const [key, value] of dataEntries) {
        switch (key) {
            case "TEMP: Question for getting the referrer of the form":
                referrerValue = value.toString();
                break;
            case "TEMP: Question for getting the requested support":
                requestedSupportValue = value.toString();
                break;
            case "TEMP: Question for getting the people being referred":
                clientsValue = value;
                break;
        }
    }
    const postObject = {
        referrer: referrerValue,
        requestedSupport: requestedSupportValue,
        clients: clientsValue,
        referralUri: documentURL,
    };

    batchPostRequests.push(postObject);

    await axios.post(`${ENDPOINT_API}/`, batchPostRequests, { headers: headers });
};
