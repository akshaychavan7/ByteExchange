import { config } from "../config";
export default async function logout() {
  try {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
      credentials: "include",
    };

    const response = await fetch(config.serverURL + "logout", requestOptions);
    const json_response = await response.json();
    return json_response;
  } catch (error) {
    console.error(`Error while calling login API: ${error}`);
  }
}
