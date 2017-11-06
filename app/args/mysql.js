exports.getSettings = getSettings;


const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);


const credsFilePath = `${__dirname}/../../creds.json`;
const allPrompts = [
  {
    type: 'input',
    name: 'host',
    message: 'Enter host',
    default: 'localhost'
  },
  {
    type: 'input',
    name: 'user',
    message: 'Enter user',
    default: 'user'
  },
  {
    type: 'input',
    name: 'password',
    message: 'Enter password',
    default: 'secret'
  },
  {
    type: 'input',
    name: 'database',
    message: 'Enter database',
    default: 'scraper'
  },
];


let creds;


async function getSettings(){
  // From memory
  if(creds && creds.mysql){
    return creds.mysql;
  }
  // From file...
  try {
    creds = require(credsFilePath);
  } catch(e){
    creds = {};
  }
  creds.mysql = creds.mysql || {};
  // ...does the object contain all the required properties?
  var prompts = allPrompts.filter(function(prompt){
    return !creds.mysql.hasOwnProperty(prompt.name);
  });
  if(!prompts.length){
    return creds.mysql;
  }
  // Prompt
  showPromptMessage();
  var answers = await inquirer.prompt(prompts)
    .then(function(answers){
      return answers;
    })
    .catch(function(err){
      console.error(err);
    });
  Object.assign(creds.mysql, answers);
  // Write the file
  await writeFile(credsFilePath, JSON.stringify(creds, null, 4));
  showWriteMessage();
  // Return
  return creds.mysql;
}


function showPromptMessage(){
  var cyan = '\033[0;36m';
  var norm = '\033[0m';
  console.log(`
·------------------------------------------ - -
| ${cyan}Please configure MySQL${norm}
| ...you only need to do this once :)
·------------------------------------------ - -
`);
}


function showWriteMessage(){
  var cyan = '\033[0;36m';
  var norm = '\033[0m';
  console.log(`
·------------------------------------------ - -
| ${cyan}Saved to creds.json${norm}
·------------------------------------------ - -
`);
}
