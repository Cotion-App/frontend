import axios from "axios";
import { BACKEND_URL } from "./constants.js";

export async function go(domain, canvasToken,courseID, courseName, dbID, notionToken) {
  return (
    axios
      .get(`${BACKEND_URL}/run/${domain}/${canvasToken}/${courseID}/${courseName}/${dbID}/${notionToken}`)
      .then(response => response.data)
  );
}

export async function notionAuth(tempCode, redirectURI) {
  return (
    axios
      .get(`${BACKEND_URL}/notion/${tempCode}/${redirectURI}`)
      .then(response => response.data)
  );
}
