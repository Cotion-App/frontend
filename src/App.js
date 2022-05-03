import { FiGithub } from "react-icons/fi";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { InvalidDomainError } from './utils/errors.js'
import { go, notionAuth } from "./utils/utils.js";
import { FRONTEND_URL } from "./utils/constants.js";


import notion_dark from "./media/notion-dark.png";
import notion from "./media/notion.png"


function App() {
  let counter = 0;
  const [hovered, setHovered] = useState(false);
  const [courseURL, setCourseURL] = useState('')
  const [courseName, setCourseName] = useState('')
  const [databaseURL, setDatabaseURL] = useState('')
  const [canvasToken, setCanvasToken] = useState(localStorage.getItem('canvasToken'))
  const [localSave, setLocalSave] = useState(localStorage.getItem('canvasToken') != null)
  const [auth, setAuth] = useState(false)
  const [notionToken, setNotionToken] = useState('')




  useEffect(() => {

    const notion_auth = async () => {
      let uri = window.location.toString()
      const queryParams = new URLSearchParams(uri.split('/')[3])

      if (queryParams.get('code') != null) {
        setAuth(true)
        let auth_token = await notionAuth(queryParams.get('code'), FRONTEND_URL)
        if (auth_token === "code_already_in_use") {
          let clean_uri = uri.substring(0, uri.indexOf("?"));
          window.history.replaceState({}, document.title, clean_uri);
        }
        setNotionToken(auth_token)
      }
    }

    notion_auth()
  }, [setNotionToken])




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

    try {

      if(!auth){
        throw Error ("You have not verified with Notion yet!")
      }

      canvasDomain = validateURL(courseURL, /[a-zA-Z0-9]*\.instructure\.com/, 'Canvas Course')

      courseID = courseURL.split("/")[4]
      if (`${/[0-9]{6}/.test(courseID)}` === 'false') {
        throw Error("Invalid Canvas Course Link")
      }

      if (courseName === '') {
        throw Error("Empty Course Alias")
      }

      if (canvasToken === '') {
        throw Error("Empty Canvas Token")
      }
      handleSave()

      validateURL(databaseURL, /notion\.so/, 'Notion Database')

      let splitDatabaseURL = databaseURL.split('/')
      dbID = splitDatabaseURL[splitDatabaseURL.length - 1].split("?")[0]
    } catch (e) {
      toast.error(e.message)
      return;
    }

    const myPromise = go(canvasDomain, canvasToken, courseID, courseName, dbID, notionToken);

    toast.promise(myPromise, {
      loading: 'Loading',
      success: (success) => `${success}`,
      error: (err) => `${err.response.data}`,
    });

  }



  // function used to handle local storage saving
  const handleSave = () => {
    if (localSave) {
      if (canvasToken.length > 0) {
        localStorage.setItem('canvasToken', canvasToken)
      }
    } else {
      localStorage.removeItem('canvasToken')
    }
  }


  return (
    <div className="App">
      <Toaster position="top-right" />
      <div className="content font-serif md:w-4/6 mx-auto p-5 max-w-xl select-none">
        <div className="header text-3xl pb-2 font-bold"> Cotion</div>
        <div className="body space-y-5 border-y-2 border-black py-4">
          {!auth ? <div className="notion-auth border-2 border-red-500 rounded-md p-4">
            <div className="mb-2">Please click the button below to reauthorize with Notion.</div>
            <button className="flex items-center" onMouseOver={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={() => window.open(`https://api.notion.com/v1/oauth/authorize?owner=user&client_id=5d758e52-4e9c-4b07-86ad-fd11ee2565aa&redirect_uri=https://${FRONTEND_URL}&response_type=code`, "_self")}>
              <img src={hovered ? notion : notion_dark} alt="N" className="object-scale-down h-8 mr-2" />
              Add to Notion
            </button>
          </div> : false}
          <div className="paste-link flex">
            {stepNumbering()}Paste the link to your course here: <input onChange={e => setCourseURL(e.target.value)} />
          </div>
          <div className="alias-class flex">
            {stepNumbering()} Create an alias for your course: <input onChange={e => setCourseName(e.target.value)} />
          </div>

          <div className="canvas-access-token">
            {stepNumbering()} Go to Canvas settings, scroll down, and click
            '+ New Access Token'. Paste your Access Token here:<input value={canvasToken} onChange={e => setCanvasToken(e.target.value)} />
            <div className="local-storage text-sm ml-5 flex items-center">
              <input className="form-check-input rounded-sm mr-2 checked:hover:bg-black checked:bg-black"
                type="checkbox" checked={localSave} onChange={e => setLocalSave(e.target.checked)} />
              Do you want to save this information to local storage?
            </div>
          </div>

          <div className="duplicate-notion-table">
            {stepNumbering()} Duplicate this <a href="https://spectacled-rainforest-118.notion.site/97429db8eadd429b8914ca480516dabc?v=ada252446d0f45bea222df0fec729abe" target="_blank" className="underline" rel="noreferrer">Notion Table</a> to your own workspace.
            Feel free to add additional columns to the table,
            but don't remove any existing columns!
          </div>

          <div className="share-table">
            {stepNumbering()} Share the duplicated table with me <span className="italic">(aghanta3@gatech.edu)</span> on Notion.
          </div>

          <div className="share-token">
            {stepNumbering()} While you're in the 'Share' panel,
            copy the link to the table and paste it here:<input onChange={e => setDatabaseURL(e.target.value)} />
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

