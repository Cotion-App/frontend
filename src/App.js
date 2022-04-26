import notion_dark from "./notion-dark.png";
import notion from "./notion.png"
import { FiGithub } from "react-icons/fi";
import { useState } from "react";

function App() {
  let counter = 0;
  const [hovered, setHovered] = useState(false);

  const stepNumbering = () => <b>{++counter + ". "}</b>

  return (
    <div className="App">
      <div className="content font-serif md:w-4/6 mx-auto p-5 max-w-xl">
        <div className="header text-3xl pb-2 font-bold"> Cotion</div>
        <div className="body space-y-5 border-y-2 border-black py-4">
          <div className="notion-auth border-2 border-red-500 rounded-md p-4">
            <div className="mb-2">Please click the button below to reauthorize with Notion.</div>
            <button className="flex items-center" onMouseOver={() => setHovered(true)} onMouseLeave={()=>setHovered(false)}>
              <img src={hovered ? notion : notion_dark} alt="N" className="object-scale-down h-8 mr-2" />
              Add to Notion
            </button>

          </div>
          <div className="paste-link flex">
            {stepNumbering()} Paste the link to your course here: <input />
          </div>

          <div className="alias-class flex">
            {stepNumbering()} Create an alias for your course: <input />
          </div>

          <div className="canvas-access-token">
            {stepNumbering()} Go to Canvas settings, scroll down, and click
            '+ New Access Token'. Paste your Access Token here:<input />
            <div className="local-storage text-sm ml-5">
              <input class="form-check-input rounded-sm mr-2 checked:hover:bg-black checked:bg-black"
                type="checkbox" />
              Do you want to save this information to local storage?
            </div>
          </div>

          <div className="duplicate-notion-table">
            {stepNumbering()} Duplicate this <a href="https://google.com/" target="_blank" className="underline" rel="noreferrer">Notion Table</a> to your own workspace.
            Feel free to add additional columns to the table,
            but don't remove any existing columns!
          </div>

          <div className="share-table">
            {stepNumbering()} Share the duplicated table with the 'Cotion' integration by clicking
            'Add people, emails, groups, or integrations' box and typing 'Cotion' in
            the search box.
          </div>
          <div className="share-token">
            {stepNumbering()} While you're in the 'Share' panel,
            copy the link to the table and paste it here:<input />
          </div>
          <div>{stepNumbering()} If you have followed all of the above steps, press <button className="ml-2 py-1">Go</button></div>
        </div>
        <div className="footer mb-10 py-2 text-gray-400 flex items-center font-sans">
          Made by Abhiram Ghanta
          <a href="https://github.com/abhiramg2021/cotion" target="_blank" rel="noreferrer">
            <FiGithub className="ml-2 hover:text-black" /></a>
        </div>
      </div>

    </div >
  );
}

export default App;

