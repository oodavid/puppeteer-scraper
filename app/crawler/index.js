module.exports.start = start;


const hud = require('../hud/');
const datastore = require('../mongo/');
const sanitize = require("sanitize-filename");
const puppeteer = require('puppeteer');
const md5 = require('md5');


let domainConfig;
let browser;


async function start(myDomainConfig, myNumThreads){
  domainConfig = myDomainConfig;
  // Title
  hud.title(`Crawling ^c${domainConfig.domain}^:`);
  // Start keyboard control
  hud.keyboard.assign('UP', increaseThreads, 'Increase Threads');
  hud.keyboard.assign('DOWN', decreaseThreads, 'Decrease Threads');
  hud.keyboard.assign('p', pause, 'Pause');
  hud.keyboard.start();
  // Update the progress bar
  updateProgress();
  // Upsert the seed URLs
  hud.message(`upserting ${domainConfig.seedUrls.length} seed URLS`);
  await datastore.upsertSeedUrls(domainConfig.seedUrls);
  hud.message(false);
  // Initialise our browser and start crawling
  browser = await puppeteer.launch();
  crawlUrls();
}





async function updateProgress(){
  let progress = await datastore.getProgress(domainConfig.domain);
  hud.progress(progress.crawled, progress.total);
  setTimeout(updateProgress, 1000);
}




let running = 0;
let max = 10;

async function getPage(){
  if(running < max){
    running ++;
    return await browser.newPage();
  }
}

async function releasePage(page){
  if(page){
    await page.close();
    running --;
  }
}

async function crawlUrls(){
  const page = await getPage();
  if(page){
    const row = await datastore.getUncrawledUrl(domainConfig.domain);
    if(row){
      crawlUrl(page, row);
      // Recur
      setTimeout(crawlUrls, 100);
    } else {
      releasePage(page);
    }
  }
}

async function crawlUrl(page, row){
  hud.urlState(row.url, 'Parsing');
  try {
    const response = await page.goto(row.url, { waitUntil: 'networkidle' });
    // Status
    const status = response.status;
    // HTML
    const html = await page.content();
    // Hash
    const hash = md5(html);
    // Links
    const links = await page.evaluate(function(){
      // ...this runs in the context of the browser
      let links = [... document.querySelectorAll('a')];
      return links.map(function(link){
        return link.href;
      });
    });
    // Screenshot
    const filename = sanitize(row.url);
    await page.screenshot({ path: `${__dirname}/../../images/${filename}.png` });
    // Store
    await datastore.updateUrl(row.id, status, html, hash, links);
  } catch(e) {
    // Log errors
    hud.error(e);
  } finally {
    // Always tidy up
    hud.urlState(row.url, false);
    await releasePage(page);
    // Spawn more crawlers
    crawlUrls();
  }
}



function increaseThreads(){
  max ++;
}
function decreaseThreads(){
  max --;
}
function pause(){
  hud.keyboard.assign('p', unpause, 'Unpause');
  hud.message('Paused - threads will spin down');
}
function unpause(){
  hud.keyboard.assign('p', pause, 'Pause');
  hud.message('Unpaused - threads will spin up');
}
