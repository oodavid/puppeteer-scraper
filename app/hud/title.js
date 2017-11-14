module.exports = title;


const writeLine = require('./writeLine.js');
const term = require('terminal-kit').terminal;


function title(title){
  writeLine(0, title);
  title = title.replace(/\^./g, ''); // Strip "Style Markup" ie: ^bBLUE^: becomes BLUE
  term.windowTitle(title);
}
