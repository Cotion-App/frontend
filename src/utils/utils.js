import axios from "axios";
import { BACKEND_URL } from "./constants.js";

export async function getAssignments(domain, courseID, dbID, course) {
  return (
    axios
      .get(`${BACKEND_URL}/run/${domain}/${courseID}/${course}/${dbID}`)
      .then((response) => console.log(response.data))
  );
}
