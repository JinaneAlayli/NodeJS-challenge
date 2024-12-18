/**
 * Json part
 */

const fs = require('fs');
 
let databaseFile = "database.json";
let tasks=[];
 
if (process.argv[2]) {
  databaseFile = process.argv[2];
}

function loadTasks() {
  try {
    if (!fs.existsSync(databaseFile)) {
      fs.writeFileSync(databaseFile, JSON.stringify([], null, 2), 'utf8');
      console.log("No saved tasks found, creating new file.");
    } else {
      const data = fs.readFileSync(databaseFile, 'utf8');
      tasks = JSON.parse(data);
      if (tasks.length===0)
        console.log("loaded file successfully with empty tasks.");
        else
      console.log("Tasks loaded successfully.");
    }
  } catch (error) {
    console.log("Error loading tasks:", error);
  }
}

 
function saveTasks() {
  try {
    const data = JSON.stringify(tasks, null, 2); 
    fs.writeFileSync(databaseFile, data, 'utf8');
    console.log("Tasks saved successfully.");
  } catch (error) {
    console.log("Error saving tasks:", error);
  }
}
 
//process.on('exit', saveTasks);

/**
 * Starts the application
 * This is the function that is run when the app starts
 * 
 * It prints a welcome line, and then a line with "----",
 * then nothing.
 *  
 * @param  {string} name the name of the app
 * @returns {void}
 */



function startApp(name){
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', onDataReceived);
  console.log(`Welcome to ${name}'s application!`);
  console.log("--------------------");
  loadTasks(); 
}


/**
 * Decides what to do depending on the data that was received
 * This function receives the input sent by the user.
 * 
 * For example, if the user entered 
 * ```
 * node tasks.js batata
 * ```
 * 
 * The text received would be "batata"
 * This function  then directs to other functions
 * 
 * @param  {string} text data typed by the user
 * @returns {void}
 */


function onDataReceived(text) {
  text = text.trim();
  if (text === 'quit'|| text==="exit") {
    quit();
  }
  else if(text.startsWith('hello')){
    hello(text);
  }
  else if(text==='help'){
    help();
  }
  else if(text==='tasks'){
    listTasks();
  }
  else if(text.startsWith('add')){
    addTask(text.slice(4));
  }
  else if(text.startsWith('remove')){
    removeTask(text.slice(7));
  }
  else if(text.startsWith('edit')){
    editTask(text.slice(5));
  }
  else if (text.startsWith('check')) {
    checkTask(text.slice(6));
  }
  else if (text.startsWith('uncheck')) {
    uncheckTask(text.slice(8));
  }
  else{
    unknownCommand(text);
  }
  
}

/**
 * prints "unknown command"
 * This function is supposed to run when all other commands have failed
 *
 * @param  {string} c the text received
 * @returns {void}
 */


function unknownCommand(c){
  console.log('unknown command: "'+c.trim()+'"')
}


/**
 * Says hello
 *
 * @returns {void}
 */
function hello(text){

  if(text.slice(6)!="")
  console.log('hello '+text.slice(6)+'!');
else
console.log('hello!');

}


/**
 * Exits the application
 *
 * @returns {void}
 */


function quit(){
  saveTasks();
  console.log('Quitting now, goodbye!')
  process.exit();
}

/**
 * display information about user commands and  their descriptions.
 *
 * @returns {void}
 */

function help() {
  console.log("Available commands:");
  console.log("-------")
  console.log("1.hello [name]  to Say hello to the given name");
  console.log("-------")
  console.log("2.quit or exit  to Exits the application.");
  console.log("-------")
  console.log("3.help  to Lists all available commands.");
  console.log("-------")
  console.log("4.tasks           - List all tasks with their numbers");
  console.log("-------")
  console.log("5.add [task]     - Add a new task to the list");
  console.log("-------")
  console.log("6.remove [index] - Remove the task at the given index. If no index is provided, remove the last task.");
  console.log("-------");
  console.log("7.edit new text   -should change the *last* task to \"new text\"\nedit 1 new text   -should change the task 1 to \"new text\"");
  console.log("-------");
  console.log("8.check [index]   - Mark task [index] as done.");
  console.log("-------")
  console.log("9.uncheck [index] - Mark task [index] as not done.");
  console.log("--------------------")
}

//list of tasks
//let tasks = ["Task 1", "Task 2", "Task 3"]; 
//let tasks = [{ text: "Task 1", done: false }, { text: "Task 2", done: false }, { text: "Task 3", done: false }];


//function to see tasks
function listTasks() {
  if (tasks.length === 0) 
    console.log("No tasks available.");
  else
   {
    for (let i = 0; i < tasks.length; i++) 
      {
        let status = "[ ]";
        if (tasks[i].done)
          {
            status = "[✓]";
          }
        //console.log((i+1)+". " +tasks[i]);
        console.log((i + 1) + ". " + status + " " + tasks[i].text);
      }
    }
  }

//add Task
function  addTask(text) {
  if (text === "") {
    console.log("Error: Cannot add an empty task.");
  } else {
    tasks.push({ text: text, done: false });
    console.log("Added task: " +text);
  }
}

//remove task
function removeTask(text) {

  if (tasks.length === 0) {
    console.log("Error: No tasks to remove.");
  } else {
    if (text=="")
    {
      tasks.pop();
      console.log("Removed the last task.");
    }else{
      if (isNaN(text) || text < 1 || text > tasks.length) {
        console.log("Error: you enter a number that does not exist.");
      } else {
        tasks.splice(text - 1, 1);
        console.log("Removed task at index " + text + ".");
      }
    }
  }
}
//edit task
function editTask(text) {
  if(tasks.length>0)
  {
  if (text=="") {
    console.log("Error:  Type 'help' for more information.");
    return;
  }
  let parts = text.trim().split(" ");

  if (isNaN(parts[0]) ){
    let newText = parts.join(" ");
    //tasks[tasks.length - 1] = newText;
    tasks[tasks.length - 1].text = newText;
    console.log(`Updated the last task to: "${newText}"`);
  }
  else if( parts[0] < 1 || parts[0] > tasks.length) {
    console.log("Error: Invalid task index.");
    } else {
          if(parts[1] ){
          let newText = parts.slice(1).join(" ");
          //tasks[parts[0] - 1] = newText;
          tasks[parts[0] - 1].text = newText;
          console.log(`Updated task ${parts[0]} to: "${newText}"`);
        }else console.log("Error: Invalid text.");
    }
  }else console.log("Error: No tasks to edit.");
}

//check
function checkTask(text) {
  if(tasks.length>0)
    {
    if (text === "") {
      console.log("Error: Please provide a task number.");
    } else {
      let index = parseInt(text);
      if (isNaN(index) || index < 1 || index > tasks.length) {
        console.log("Error: Invalid task number.");
      } else {
        tasks[index - 1].done = true;
        console.log(`Task ${index} marked as done.`);
      }
    }
  }else console.log("Error: No tasks to edit.");
}
//uncheck
function uncheckTask(text) {
  if(tasks.length>0)
    {
  if (text === "") {
    console.log("Error: Please provide a task number.");
  } else {
    let index = parseInt(text);
    if (isNaN(index) || index < 1 || index > tasks.length) {
      console.log("Error: Invalid task number.");
    } else {
      tasks[index - 1].done = false;
      console.log(`Task ${index} marked as not done.`);
    }
  }
}else console.log("Error: No tasks to edit.");
}


// The following line starts the application
startApp("Jinane")
