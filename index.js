const messages = require('./app/messages/');
const args = require('./app/args/');
const mysql = require('./app/mysql/');


(async () => {
  messages.printIntro();
  await mysql.init();
  const action = await args.getAction();
  const domain = await args.getDomain();
  messages.printMessage('Running scraper with command:', `node index.js --action ${action} --domain ${domain}`);
  if(action === 'crawl'){
    const crawler = require('./app/crawler/');
    crawler.start(domain);
  } else {
    const parser = require('./app/parser/');
    parser.start(domain);
  }
})();
