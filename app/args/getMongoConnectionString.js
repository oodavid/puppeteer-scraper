module.exports = getMongoConnectionString;


const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const term = require('terminal-kit').terminal;


const credsFilePath = `${__dirname}/../../creds.json`;


let creds;


async function getMongoConnectionString(){
  // From memory
  if(creds && creds.mongoConnectionString){
    return creds.mongoConnectionString;
  }
  // From file...
  try {
    creds = require(credsFilePath);
  } catch(e){
    creds = {};
  }
  if(creds.mongoConnectionString){
    return creds.mongoConnectionString;
  }
  // Prompt
  var answers = await inquirer.prompt([{
    type: 'input',
    name: 'mongoConnectionString',
    message: 'Please Enter your MongoDB Connection String',
  }]);
  // Update
  creds.mongoConnectionString = answers.mongoConnectionString;
  // Write the file
  await writeFile(credsFilePath, JSON.stringify(creds, null, 4));
  term(`^r❯^: ^+MongoDB settings saved to^: ^ccreds.json^:\n`);
  // Return
  return creds.mongoConnectionString;
}
