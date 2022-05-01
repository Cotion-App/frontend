import axios from "axios";
import { BACKEND_URL } from "./constants.js";

export async function getThings(domain, courseID, dbID, course) {
  return (
    axios
      .get(`${BACKEND_URL}/run/${domain}/${courseID}/${dbID}/${course}`)
      .then((response) => console.log(response.data))
  );
}
