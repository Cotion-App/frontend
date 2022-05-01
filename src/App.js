import { FiGithub } from "react-icons/fi";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import {InvalidCourseIDError, InvalidDomainError} from './utils/errors.js'
import { getThings } from "./utils/utils.js";




function App() {
  let counter = 0;
  const [courseURL, setCourseURL] = useState('')
  const [courseName, setCourseName] = useState('')
  const [databaseURL, setDatabaseURL] = useState('')

  const stepNumbering = () => <b>{++counter + ". "}</b>

  const handleClick = () => {
    let domain = ""
    let courseID = ""
    
    try {
      domain = new URL(courseURL).hostname

      if (`${/[a-zA-Z0-9]*\.instructure\.com/.test(domain)}` === 'false'){
        throw InvalidDomainError
      }

      courseID = courseURL.split("/")[4]
      
      if (`${/[0-9]{6}/.test(courseID)}` === 'false'){
        throw InvalidCourseIDError
      }

    } catch (e){
      if (e instanceof TypeError){
        if (courseURL.length === 0){
          toast.error("You have not entered in a course URL yet.")
        } else {
          toast.error("Invalid course URL Format.")
        }

      } else if (e instanceof InvalidDomainError) {
        toast.error("Invalid Canvas Domain Format.")
      } else if (e instanceof InvalidCourseIDError){
        toast.error("Invalid CourseID Format.")
      }

      return;
    }

    if (courseName === ''){
      toast.error("Empty Course Alias")
      return;
    }

    try{
      let databaseDomain = new URL(databaseURL).hostname
      toast(databaseDomain)
      if (`${/notion\.so/.test(databaseDomain)}` === 'false'){
        toast.error("Invalid Notion Domain Format.")
        return;
      }
    } catch (e){
      if (e instanceof TypeError){
        if (databaseURL.length === 0){
          toast.error("You have not entered in a database URL yet.")
        } else {
          toast.error("Invalid database URL Format.")
        } 

      } 
    }

    let dbID = databaseURL.split('/')[4].split("?")[0]
    getThings(domain, courseID, courseName, dbID)

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
            {stepNumbering()} Create an alias for your course: <input onChange = {e => setCourseName(e.target.value)}/>
          </div>

          <div className="duplicate-notion-table">
            {stepNumbering()} Duplicate this <a href="https://spectacled-rainforest-118.notion.site/97429db8eadd429b8914ca480516dabc?v=ada252446d0f45bea222df0fec729abe" target="_blank" className="underline" rel="noreferrer">Notion Table</a> to your own workspace.
            Feel free to add additional columns to the table,
            but don't remove any existing columns!
          </div>

          <div className="share-token">
            {stepNumbering()} While you're in the 'Share' panel,
            copy the link to the table and paste it here:<input onChange={e=> setDatabaseURL(e.target.value)}/>
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

