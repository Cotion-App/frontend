import axios from "axios";
import { BACKEND_URL } from "./constants.js";

export async function getThings(domain, userToken, courseID) {
  return (
    axios
      .get(`${BACKEND_URL}/canvas/get_assignments/${domain}/${userToken}/${courseID}`)
      .then((response) => console.log(response.data))
  );
}