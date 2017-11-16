module.exports = getThreads;


const argv = require('yargs').argv;
const inquirer = require('inquirer');


let threads;


async function getThreads(){
  // From memory
  if(threads){
    return threads;
  }
  // From the command-line
  if(argv.threads){
    threads = argv.threads;
    return threads;
  }
  // Prompt
  return inquirer.prompt([
    {
      type: 'input',
      name: 'threads',
      message: 'How many threads to run?',
      default: 10,
      filter: function(value){
        return parseInt(value, 10);
      },
      validate: function(value){
        var isValid = (value > 0 && value === parseInt(value, 10));
        return isValid || "Please enter an integer";
      }
    }
  ])
  .then(function(answers){
    threads = answers.threads;
    return threads;
  })
  .catch(function(err){
    console.error(err);
  });
}
