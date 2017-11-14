module.exports.start = start;


const webgraph = require('../webgraph/');
const hud = require('../hud/');


async function start(domain){
  const domainConfig = require(`../../domains/${domain}/`);
  // Upsert the seed URLs
  console.log(`upserting ${domainConfig.seedUrls.length} seed URLS`);
  await webgraph.upsertSeedUrls(domainConfig.domain, domainConfig.seedUrls);

  // ARGS/inquirer for initial # of threads

  // Title
  hud.title(`Crawling ^b${domain}^:`);
  // Start keyboard control
  hud.keyboard.assign('UP', someFunction, 'Increase Threads');
  hud.keyboard.assign('DOWN', someFunction, 'Increase Threads');
  hud.keyboard.assign('p', pause, 'Pause');
  hud.keyboard.start();

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
  // console.log('someFunction called');
}

function pause(){
  keyboard.assign('p', unpause, 'Unpause');
}
function unpause(){
  keyboard.assign('p', pause, 'Pause');
}
