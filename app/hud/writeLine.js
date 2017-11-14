module.exports = writeLine;


const numLines = require('./numLines.js');
const initOnce = require('./initOnce.js');
const term = require('terminal-kit').terminal;


function writeLine(n, message){
  initOnce();
  term.restoreCursor();
  term.column(0).move(0, n-numLines).eraseLine();
  term(message);
  term.restoreCursor();
}
