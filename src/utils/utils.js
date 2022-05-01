import axios from "axios";
import { BACKEND_URL } from "./constants.js";

export async function getAssignments(domain, canvasToken,courseID, courseName, dbID) {
  return (
    axios
      .get(`${BACKEND_URL}/run/${domain}/${canvasToken}/${courseID}/${courseName}/${dbID}`)
      .then((response) => console.log(response.data))
  );
}
