module.exports = progress;


const numLines = require('./numLines.js');
const initOnce = require('./initOnce.js');
const term = require('terminal-kit').terminal;


function progress(completed, total){
  // The meter
  var len = 70;
  var pct = total ? (completed / total) : 0;
  var left = Array(Math.round(len*pct)).join('=');
  var right = Array(1+len-Math.round(len*pct)).join('-');
  // The string
  var pctStr = Math.floor(pct * 100);
  var str = `Progress [^g${left}^:^-${right}^:] ${pctStr}% [^g${completed.toLocaleString()}^: / ${total.toLocaleString()}]`;
  // Output
  initOnce();
  term.restoreCursor();
  term.column(0).move(0, 3-numLines).eraseLine();
  term(str);
  term.restoreCursor();
}
