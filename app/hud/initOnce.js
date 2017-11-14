module.exports = initOnce;


const numLines = require('./numLines.js');
const term = require('terminal-kit').terminal;


let initRun = false;
function initOnce(){
  if(initRun){ return; }
  initRun = true;
  console.log((new Array(numLines+1)).join('\n'));
  term.saveCursor();
}
