const hud = require('./app/hud/');
const args = require('./app/args/');
const datastore = require('./app/mongo/');
const term = require('terminal-kit').terminal;


(async () => {
  hud.intro();
  // Connect to MySQL
  await datastore.init();
  // Get the arguments
  const action = await args.getAction();
  const domainName = await args.getDomain();
  const numThreads = await args.getThreads();
  term(`^r❯^: ^+To run this without prompts, use^:\n`);
  term(`^r❯^: ^-node index.js --action ${action} --domain ${domainName} --threads ${numThreads}^:\n`);
  // Read the config
  const domainConfig = require(`./domains/${domainName}/`);
  // Start the action
  if(action === 'crawl'){
    const crawler = require('./app/crawler/');
    crawler.start(domainConfig, numThreads);
  } else {
    const parser = require('./app/parser/');
    parser.start(domainConfig, numThreads);
  }
})();
