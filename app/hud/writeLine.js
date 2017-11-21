module.exports = writeLine;


const numLines = require('./numLines.js');
const initOnce = require('./initOnce.js');
const term = require('terminal-kit').terminal;


const maxLength = 100;


function writeLine(n, message){
  // Sanitize the message
  message = message.replace(/[\r\n]/g, ''); // Strip newlines
  message = message.substring(0, maxLength); // Clip the length
  // Write
  initOnce();
  term.restoreCursor();
  term.column(0).move(0, n-numLines).eraseLine();
  term(message);
  term.restoreCursor();
}
