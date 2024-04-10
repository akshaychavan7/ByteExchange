import config from "../config";
export default async function isAuthenticated() {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      // redirect: "follow",
      credentials: "include",
    };

    const response = await fetch(
      config.serverURL + "isUserAuthenticated",
      requestOptions
    );
    return response.status == 200;
  } catch (error) {
    console.error(`Error while calling isUserAuthenticated API: ${error}`);
  }
}
