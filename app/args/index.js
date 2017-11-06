const action = require('./action.js');
const domain = require('./domain.js');
const mysql = require('./mysql.js');


exports.getAction = action.getAction;
exports.getDomain = domain.getDomain;
exports.getMysqlSettings = mysql.getSettings;
exports.printCommand = printCommand;


const argv = require('yargs').argv;


function printCommand(action, domain){
  var cyan = '\033[0;36m';
  var norm = '\033[0m';
  var cmd = `node ${argv.$0} --action ${action} --domain ${domain}`;
  console.log(`
·------------------------------------------ - -
| ${cyan}Running command:${norm}
| ${cmd}
·------------------------------------------ - -
`);
}
