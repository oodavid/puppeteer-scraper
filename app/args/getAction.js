module.exports = getAction;


const argv = require('yargs').argv;
const inquirer = require('inquirer');


const actions = {
  'Crawl and Parse': 'crawl',
  'Just Parse': 'parse',
};
let action;


async function getAction(){
  // From memory
  if(action){
    return action;
  }
  // From the command-line
  if(argv.action){
    action = argv.action;
    return action;
  }
  // Prompt
  return inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: Object.keys(actions),
    }
  ])
  .then(function(answers){
    action = actions[answers.action];
    return action;
  })
  .catch(function(err){
    console.error(err);
  });
}
