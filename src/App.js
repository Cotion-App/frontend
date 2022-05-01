import { FiGithub } from "react-icons/fi";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { InvalidDomainError } from './utils/errors.js'
import { getAssignments } from "./utils/utils.js";


function App() {
  let counter = 0;
  const [courseURL, setCourseURL] = useState('')
  const [courseName, setCourseName] = useState('')
  const [databaseURL, setDatabaseURL] = useState('')
  const [canvasToken, setCanvasToken] = useState(localStorage.getItem('canvasToken'))

  const [localSave, setLocalSave] = useState(localStorage.getItem('canvasToken') != null)

  // numbered rendering in output
  const stepNumbering = () => <b>{++counter + ". "}</b>

  // url parsing logic
  const validateURL = (url, format, host) => {
    let domain = ""
    try {
      domain = new URL(url).hostname

      if (`${format.test(domain)}` === 'false') {
        throw InvalidDomainError
      }
      return domain;
    } catch (e) {
      if (e instanceof TypeError) {
        if (url.length === 0) {
          throw Error(`You have not entered in a ${host} URL yet.`)
        } else {
          throw Error(`Invalid ${host} URL Format.`)
        }

      } else if (e instanceof InvalidDomainError) {
        throw Error(`Invalid ${host} Domain Format.`)
      }
    }
  }

  // used to handle "Go" button click
  const handleGoClick = () => {
    let canvasDomain = ""
    let courseID = ""
    let dbID = ""

    try {
      canvasDomain = validateURL(courseURL, /[a-zA-Z0-9]*\.instructure\.com/, 'Canvas')

      courseID = courseURL.split("/")[4]
      if (`${/[0-9]{6}/.test(courseID)}` === 'false') {
        throw Error("Invalid CourseID Format.")
      }

      if (courseName === '') {
        throw Error("Empty Course Alias")
      }

      if (canvasToken === ''){
        throw Error("Empty Canvas Token")
      }
      handleSave()
      
      validateURL(databaseURL, /notion\.so/, 'Notion')

      dbID = databaseURL.split('/')[4].split("?")[0]
    } catch (e) {
      toast.error(e.message)
      return;
    }

    let out = getAssignments(canvasDomain, canvasToken,courseID, courseName, dbID)

    // tell user if anything went wrong
    if (out === 'success') {
      toast.success(out)
    } else {
      toast.error(out)
    }

    

  }

  // function used to handle local storage saving
  const handleSave = () => {
    if (localSave){
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
          <div className="paste-link flex">
            {stepNumbering()} Paste the link to your course here: <input onChange={e => setCourseURL(e.target.value)} />
          </div>
          <div className="alias-class flex">
            {stepNumbering()} Create an alias for your course: <input onChange={e => setCourseName(e.target.value)} />
          </div>

          <div className="canvas-access-token">
            {stepNumbering()} Go to Canvas settings, scroll down, and click
            '+ New Access Token'. Paste your Access Token here:<input value = {canvasToken} onChange={e => setCanvasToken(e.target.value)} />
            <div className="local-storage text-sm ml-5 flex items-center">
              <input class="form-check-input rounded-sm mr-2 checked:hover:bg-black checked:bg-black"
                type="checkbox" checked = {localSave} onChange = {e => setLocalSave(e.target.checked)}/>
              Do you want to save this information to local storage?
            </div>
          </div>

          <div className="duplicate-notion-table">
            {stepNumbering()} Duplicate this <a href="https://spectacled-rainforest-118.notion.site/97429db8eadd429b8914ca480516dabc?v=ada252446d0f45bea222df0fec729abe" target="_blank" className="underline" rel="noreferrer">Notion Table</a> to your own workspace.
            Feel free to add additional columns to the table,
            but don't remove any existing columns!
          </div>

          <div className="share-table">
            {stepNumbering()} Share the duplicated table with me on Notion.
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

