module.exports.start = start;


const webgraph = require('../webgraph/');
const keyboard = require('./keyboard.js');


async function start(domain){
  const domainConfig = require(`../../domains/${domain}/`);
  console.log(`crawling ${domain}`);
  // Upsert the seed URLs
  console.log(`upserting ${domainConfig.seedUrls.length} seed URLS`);
  await webgraph.upsertSeedUrls(domainConfig.domain, domainConfig.seedUrls);

  // ARGS/inquirer for initial # of threads

  // Start keyboard control
  keyboard.assign('up', someFunction, 'Increase Threads');
  keyboard.assign('down', someFunction, 'Increase Threads');
  keyboard.assign('p', someFunction, 'Pause / Unpause');
  keyboard.start();

  // initialise crawlers (see: crawler.js)
    // get browser
    // load URL
    let url = await webgraph.getUncrawledUrl(domainConfig.domain);
    console.log(url);
    // parse Links
    // upsert HTML, status, links
    // release browser
}


function someFunction(){
  console.log('someFunction called');
}
