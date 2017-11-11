const messages = require('./app/messages/');
const args = require('./app/args/');
const mysql = require('./app/mysql/');


(async () => {

  messages.printIntro();
  await mysql.init();
  const action = await args.getAction();
  const domain = await args.getDomain();

  messages.printMessage('Running scraper with command:', `node index.js --action ${action} --domain ${domain}`);

  // Read the config file
  // upsert the seed URLs
  // Start scraping


  console.log(action);
  console.log(domain);

  process.exit();
})();
