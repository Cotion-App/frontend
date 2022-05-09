# Cotion Frontend
> Convert your Canvas assignments to Notion tasks

## Overview
The website is a single page application built using [`create-react-app`](https://github.com/facebook/create-react-app) that forms the frontend when users go to [cotion.herokuapp.com](cotion.herokuapp.com). It is written in [JavaScript](https://www.javascript.com), and uses [TailwindCSS](https://tailwindcss.com) for styling. 

### Inspiration
I originally sought out to find a website that could automate the process of uploading my Canvas Assignments to Notion, and I stumbled upon [Edutools for Notion](https://edutools.srg.id.au/guide/assignments-to-db/index.html). Unfortunately, no matter how long I tinkered with the website, it did not seem to work for me. So using this website as an inspiration, I put together my own Canvas To Notion workflow called Cotion.

### Goals
Although some professors release all of their course schedules at the start of the semester, some professors release their course schedule in chunks throughout the semester. If a user used Cotion multiple times throughout the semester, I wanted Cotion to only add new assignments. For any existing assignments in the database, Cotion would check to see if there was a change in due date, and update as necessary. 

### Future Features
In Notion, I find myself categorizing my assignments by type (ie. HW, Tests, Quizzes, etc.) once I have uploaded the Canvas Assignments to Notion. I want the ability to assign a preliminary assignment category for each assignment automatically while using Cotion. 

## Running Locally
### Requisite Software
- [Node.js](https://nodejs.dev) (any recent version should work)
- Installation of [npm](https://www.npmjs.com) (node package manager)

After cloning the repo to your local machine, run the following lines of code in the repo folder:

```
npm i
````
This installs all dependencies and stores them in a folder called `node_modules`. This only needs to be run once.

Then to start a local instance of the frontend, run:

```
npm start
```

The app should be viewable at `localhost:3000`. 

