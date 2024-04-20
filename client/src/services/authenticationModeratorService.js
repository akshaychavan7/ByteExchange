import { config } from "../config";
export default async function isModeratorAuthenticated() {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      credentials: "include",
    };

    const response = await fetch(
      config.serverURL + "isUserModeratorAuthenticated",
      requestOptions
    );
    return response.status == 200;
  } catch (error) {
    console.error(`Error while calling isUserAuthenticated API: ${error}`);
  }
}
