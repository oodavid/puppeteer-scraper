const args = require('./app/args/');
const mysql = require('./app/mysql/');


(async () => {

  dumpMessage(`
∇   ____   ∇
| :      : |  ·---------------------------- - -
{| ♥    ♥ |}  | Web Scraper; Crawler and Parser
 |___==___|   |                    oodavid 2017
/          \\  ·---------------------------- - -
`);

  const database = await mysql.getConnection();
  const action = await args.getAction();
  const domain = await args.getDomain();
  args.printCommand(action, domain);

  console.log(action);
  console.log(domain);
  console.log(database);

})();


function dumpMessage(msg){
  var red = '\033[0;31m';
  var norm = '\033[0m';
  msg = msg.replace(/([∇♥])/g, `${red}$1${norm}`)
  console.log(msg);
}
