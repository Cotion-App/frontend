import { FiGithub } from "react-icons/fi";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { go, notionAuth } from "./utils/utils.js";
import { FRONTEND_URL } from "./utils/constants.js";

function App() {
  let counter = 0;
  const [databaseURL, setDatabaseURL] = useState(sessionStorage.getItem("shared-link") ?? "")
  const [courseURL, setCourseURL] = useState(sessionStorage.getItem("course-link") ?? "")
  const [courseAlias, setCourseAlias] = useState(sessionStorage.getItem("course-alias") ?? "")
  const [canvasToken, setCanvasToken] = useState(sessionStorage.getItem("canvas-token") ?? "")
  const [auth, setAuth] = useState(false)


  const notion_auth = async () => {
    let uri = window.location.toString()
    const queryParams = new URLSearchParams(uri.split('/')[3])

    if (queryParams.get('code') != null) {
      let res = await notionAuth(queryParams.get('code'), FRONTEND_URL)
      if (res === 401) {
        setAuth(false)
      } else {
        return res
      }
    }
  }

  useEffect(() => {
    let uri = window.location.toString()
    const queryParams = new URLSearchParams(uri.split('/')[3])

    if (queryParams.get('code') != null) {
      setAuth(true)
    }


  }, [])


  // numbered rendering in output
  const stepNumbering = () => <b>{++counter + ". "}</b>

  // url parsing logic
  const validateURL = (url, format, host) => {

    try {
      let domain = new URL(url).hostname

      if (!format.test(domain)) {
        throw new Error()
      }
      return domain;
    } catch (e) {
      if (url.length === 0) {
        throw Error(`Empty ${host} URL`)
      } else {
        throw Error(`Invalid ${host} URL`)
      }
    }
  }


  // used to handle "Go" button click
  const handleGoClick = async () => {
    let canvasDomain = ""
    let courseID = ""
    let dbID = ""
    let notionToken = await notion_auth()


    try {
      if (notionToken === undefined) {
        throw Error("Please Reauthorize")
      }
      if (!auth) {
        throw Error("You have not verified with Notion yet!")
      }

      canvasDomain = validateURL(courseURL, /[a-zA-Z0-9]*\.instructure\.com/, 'Canvas Course')

      courseID = courseURL.split("/")[4]
      if (`${/[0-9]{6}/.test(courseID)}` === 'false') {
        throw Error("Invalid Canvas Course Link")
      }

      if (courseAlias === '') {
        throw Error("Empty Course Alias")
      }

      if (canvasToken === '') {
        throw Error("Empty Canvas Token")
      }

      validateURL(databaseURL, /notion\.so/, 'Notion Database')

      let splitDatabaseURL = databaseURL.split('/')
      dbID = splitDatabaseURL[splitDatabaseURL.length - 1].split("?")[0]
    } catch (e) {
      toast.error(e.message)
      return;
    }

    const myPromise = go(canvasDomain, canvasToken, courseID, courseAlias, dbID, notionToken);

    toast.promise(myPromise, {
      loading: 'Loading',
      success: (success) => `${success}`,
      error: (err) => `${err.response.data}`,
    });

  }


  return (
    <div className="App">
      <Toaster position="top-right" />
      <div className="content font-serif md:w-5/6 mx-auto p-5 max-w-xl select-none">
        <div className="header text-3xl pb-2 font-bold"> Cotion</div>
        <div className="body space-y-5 border-y-2 border-black py-4">
        <div className="duplicate-notion-table">
            {stepNumbering()} Duplicate this <a href="https://spectacled-rainforest-118.notion.site/97429db8eadd429b8914ca480516dabc?v=ada252446d0f45bea222df0fec729abe" target="_blank" rel="noreferrer">Notion Table</a>.
            Feel free to add additional columns to the table, but don't remove any existing columns!
          </div>

          {!auth ?
            <div className="authorize-with-notion">
              {stepNumbering()}Please click <a href={`https://api.notion.com/v1/oauth/authorize?owner=user&client_id=5d758e52-4e9c-4b07-86ad-fd11ee2565aa&redirect_uri=https://${FRONTEND_URL}&response_type=code`}>here</a> below to authorize with Notion. This step should disappear if you have authorized with Notion.
            </div> : false}


          <div className="share-table">
            {stepNumbering()} Share the duplicated table with the 'Cotion' using the 'Share' button in the top right.
          </div>

          <div className="share-token">
            {stepNumbering()} While you're in the 'Share' panel,
            copy the link to the table and paste it here:<input value={databaseURL} onChange={e => {
              sessionStorage.setItem("shared-link",e.target.value)
              setDatabaseURL(e.target.value)
            }} />
          </div>
          <div className="paste-link">
            {stepNumbering()}Paste the link to your course here: <input value={courseURL} onChange={e => {
              sessionStorage.setItem("course-link", e.target.value)
              setCourseURL(e.target.value)
            }} />
          </div>
          <div className="alias-class">
            {stepNumbering()} Create an alias for your course: <input value={courseAlias} onChange={e => {
              sessionStorage.setItem("course-alias", e.target.value)
              setCourseAlias(e.target.value)}} />
          </div>

          <div className="canvas-access-token">
            {stepNumbering()} Go to Canvas settings, scroll down, and click
            '+ New Access Token'. Paste your Access Token here:<input value={canvasToken} onChange={e => {
              sessionStorage.setItem("canvas-token", e.target.value)
              setCanvasToken(e.target.value)}} />
          </div>

          
          <div>{stepNumbering()} If you have followed all of the above steps, press <button className="ml-2 py-1" onClick={() => handleGoClick()}>Go</button></div>
        </div>
        <div className="footer mb-10 py-2 text-gray-400 flex items-center font-sans">
          Made by Abhiram Ghanta
          <a href="https://github.com/Cotion-App/" target="_blank" rel="noreferrer">
            <FiGithub className="ml-2 hover:text-black" /></a>
        </div>
      </div>

    </div >
  );
}

export default App;

