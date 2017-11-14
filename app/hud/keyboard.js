module.exports.assign = assign;
module.exports.start = start;


const term = require('terminal-kit').terminal;
const writeLine = require('./writeLine.js');


let keys = {
  // keyName: { command, description }
};
let isActive = false;


function assign(keyName, command, description){
  keys[keyName] = { command, description }; // ES6 syntactic sugar
  renderKeys();
}


function start(){
  // Only start when inactive
  if(isActive){ return; }
  isActive = true;
  // Listen for input
  term.grabInput(true);
  term.on('key', function(keyName, matches, data){
    // Has that key been assigned?
    if(keys.hasOwnProperty(keyName)){
      keys[keyName].command();
    }
    // Manually handle the exit command
    if(keyName === 'CTRL_C'){
      terminate();
      return;
    }
  });
  // Render the keys to screen
  renderKeys();
}


function terminate(){
	term.grabInput(false);
	setTimeout(function(){
    process.exit();
  }, 100);
}


function renderKeys(){
  if(!isActive){ return; }
  let commands = ['[CTRL+C] to exit'];
  Object.entries(keys).forEach(function(value){
    commands.push(`[${value[0]}] ${value[1].description}`);
  });
  writeLine(1, `^K${commands.join(', ')}^:`);
}
