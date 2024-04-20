import { config } from "../config";
export default async function register(requestObject) {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const body = JSON.stringify(requestObject);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: body,
      redirect: "follow",
      credentials: "include",
    };

    const response = await fetch(
      config.serverURL + "login/register",
      requestOptions
    );
    const json_response = await response.json();
    return json_response;
  } catch (error) {
    console.error(`Error while calling register API: ${error}`);
  }
}
