module.exports.assign = assign;
module.exports.start = start;


const keypress = require('keypress');


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
  // Force `process.stdin` to emit `keypress` (and `mousepress`) events
  keypress(process.stdin);
  // Listen for the "keypress" event
  process.stdin.on('keypress', function (ch, key) {
    // Has that key been assigned?
    if(keys.hasOwnProperty(key.name)){
      keys[key.name].command();
    }
    // Manually handle the exit command
    if(key && key.ctrl && key.name == 'c'){
      process.exit();
    }
  });
  // Enable raw mode so the input is available character-by-character
  process.stdin.setRawMode(true);
  process.stdin.resume();
  // Render the keys to screen
  renderKeys();
}


function renderKeys(){
  if(!isActive){ return; }
  var commands = Object.entries(keys)
    .map(function(value){
      return `[${value[0].toUpperCase()}] ${value[1].description}`;
    })
    .join(', ');
  console.log(`KEYBOARD: ${commands}`);
}
