import axios from "axios";
import { BACKEND_URL } from "./constants.js";

export async function go(domain, canvasToken,courseID, courseName, dbID) {
  return (
    axios
      .get(`${BACKEND_URL}/run/${domain}/${canvasToken}/${courseID}/${courseName}/${dbID}`)
      .then(response => response.data)
  );
}
