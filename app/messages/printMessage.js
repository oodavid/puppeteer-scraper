module.exports = printMessage;


function printMessage(title, message){
  var cyan = '\033[0;36m';
  var norm = '\033[0m';
  var str = `
·------------------------------------------ - -
| ${cyan}${title}${norm}
| ${message || ''}
·------------------------------------------ - -
`;
  console.log(str.replace(/\n\|\s*\n/, '\n'));
}
