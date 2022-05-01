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
          toast.error(`You have not entered in a ${host} URL yet.`)
        } else {
          toast.error(`Invalid ${host} URL Format.`)
        }

      } else if (e instanceof InvalidDomainError) {
        toast.error(`Invalid ${host} Domain Format.`)
      }
      return 'error';
    }
  }

  const handleClick = () => {
    let canvasDomain = validateURL(courseURL, /[a-zA-Z0-9]*\.instructure\.com/, 'Canvas')
    if (canvasDomain === 'error'){
      return;
    }

    let courseID = courseURL.split("/")[4]
    if (`${/[0-9]{6}/.test(courseID)}` === 'false') {
      toast.error("Invalid CourseID Format.")
      return;
    }

    if (courseName === '') {
      toast.error("Empty Course Alias")
      return;
    }

    let databaseDomain = validateURL(databaseURL, /notion\.so/, 'Notion')
    if (databaseDomain === 'error'){
      return;
    }
    
    // maybe add parsing to verify dbID correctness
    let dbID = databaseURL.split('/')[4].split("?")[0]

    
    let out = getAssignments(canvasDomain, courseID, courseName, dbID)

    // tell user if anything went wrong
    if (out === 'success') {
      toast.success(out)
    } else {
      toast.error(out)
    }

  }





  return (
    <div className="App">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="content font-serif md:w-4/6 mx-auto p-5 max-w-xl select-none">
        <div className="header text-3xl pb-2 font-bold"> Cotion</div>
        <div className="body space-y-5 border-y-2 border-black py-4">
          <div className="paste-link flex">
            {stepNumbering()} Paste the link to your course here: <input onChange={e => setCourseURL(e.target.value)} />
          </div>

          <div className="alias-class flex">
            {stepNumbering()} Create an alias for your course: <input onChange={e => setCourseName(e.target.value)} />
          </div>

          <div className="duplicate-notion-table">
            {stepNumbering()} Duplicate this <a href="https://spectacled-rainforest-118.notion.site/97429db8eadd429b8914ca480516dabc?v=ada252446d0f45bea222df0fec729abe" target="_blank" className="underline" rel="noreferrer">Notion Table</a> to your own workspace.
            Feel free to add additional columns to the table,
            but don't remove any existing columns!
          </div>

          <div className="share-token">
            {stepNumbering()} While you're in the 'Share' panel,
            copy the link to the table and paste it here:<input onChange={e => setDatabaseURL(e.target.value)} />
          </div>
          <div>{stepNumbering()} If you have followed all of the above steps, press <button className="ml-2 py-1" onClick={() => handleClick()}>Go</button></div>
        </div>
        <div className="footer mb-10 py-2 text-gray-400 flex items-center font-sans">
          Made by Abhiram Ghanta
          <a href="https://github.com/Cotion-App/frontend" target="_blank" rel="noreferrer">
            <FiGithub className="ml-2 hover:text-black" /></a>
        </div>
      </div>

    </div >
  );
}

export default App;

