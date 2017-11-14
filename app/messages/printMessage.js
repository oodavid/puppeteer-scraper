module.exports = printMessage;


const term = require('terminal-kit').terminal;


function printMessage(title, ...messages){
  var lines = [];
  lines.push('');
  lines.push('·------------------------------------------ - -');
  lines.push(`| ^c${title}^:`);
  lines.push(...messages.map(function(message){ return `| ${message}` }));
  lines.push('·------------------------------------------ - -');
  lines.push('');
  term(lines.join('\n'));
}
