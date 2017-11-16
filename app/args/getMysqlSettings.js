module.exports = getMysqlSettings;


const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const term = require('terminal-kit').terminal;


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
    default: 'charlotte'
  },
  {
    type: 'password',
    name: 'password',
    message: 'Enter password',
    default: 'Wilbur'
  },
  {
    type: 'input',
    name: 'database',
    message: 'Enter database',
    default: 'scraper'
  },
  {
    type: 'input',
    name: 'connectionLimit',
    message: 'Connection Limit',
    default: 10,
    filter: function(value){
      return parseInt(value, 10);
    },
    validate: function(value){
      var isValid = (value > 0 && value === parseInt(value, 10));
      return isValid || "Please enter an integer";
    }
  }
];


let creds;


async function getMysqlSettings(){
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
  term(`^r❯^: ^+Please Configure MySQL^: ^-(you only need to do this once)^:\n`);
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
  term(`^r❯^: ^+MySQL settings saved to^: ^ccreds.json^:\n`);
  // Return
  return creds.mysql;
}
