import { config } from "../config";

//upvote
export async function upvote(requestObject) {
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
      config.serverURL + "vote/upvote",
      requestOptions
    );
    const json_response = await response.json();
    return json_response;
  } catch (error) {
    console.error(`Error while calling upvote API: ${error}`);
  }
}

//downvote
export async function downvote(requestObject) {
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
      config.serverURL + "vote/downvote",
      requestOptions
    );
    const json_response = await response.json();
    return json_response;
  } catch (error) {
    console.error(`Error while calling downvote API: ${error}`);
  }
}
