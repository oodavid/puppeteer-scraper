exports.getDomain = getDomain;


const argv = require('yargs').argv;
const inquirer = require('inquirer');
const autocomplete = require('inquirer-autocomplete-prompt');
const fuzzy = require('fuzzy');
const glob = require('glob');
inquirer.registerPrompt('autocomplete', autocomplete);


let domain;


async function getDomain(){
  // From memory
  if(domain){
    return domain;
  }
  // From the command-line
  if(argv.domain){
    domain = argv.domain;
    return domain;
  }
  // Prompt
  return inquirer.prompt([
    {
      type: 'autocomplete',
      name: 'domain',
      message: 'Which domain?',
      source: autocompleteDomains,
    },
  ])
  .then(function(answers){
    domain = answers.domain;
    return domain;
  })
  .catch(function(err){
    console.error(err);
  });
}


var domainsCache = false;
function getDomains(){
  if(!domainsCache){
    domainsCache = glob
      .sync('./domains/*/')
      .map(function(path){
        return path.split('/').splice(-2, 1).pop();
      })
      .filter(function(path){
        return path !== 'template';
      });
  }
  return domainsCache;
}


function autocompleteDomains(answersSoFar, input){
  return new Promise(function(resolve, reject){
    resolve(
      fuzzy
        .filter((input || ''), getDomains())
        .map(el => el.original)
    );
  });
}
