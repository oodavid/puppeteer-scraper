module.exports.start = start;


const hud = require('../hud/');
const datastore = require('../mongo/');
const sanitize = require("sanitize-filename");
const puppeteer = require('puppeteer');
const md5 = require('md5');


let domainConfig;
let browser;
let runningThreads = 0;
let maxThreads = 10;


async function start(myDomainConfig, myNumThreads){
  domainConfig = myDomainConfig;
  maxThreads = myNumThreads;
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
  await datastore.upsertNewUrls(domainConfig, domainConfig.seedUrls);
  // Initialise our browser and start crawling
  browser = await puppeteer.launch();
  crawlUrls();
}





async function updateProgress(){
  try {
    let progress = await datastore.getProgress(domainConfig.domain);
    hud.progress(progress.crawled, progress.total);
  } catch (e) {
    hud.error(e);
  } finally {
    setTimeout(updateProgress, 1000);
  }
}





async function getPage(){
  if(runningThreads < maxThreads){
    runningThreads ++;
    return await browser.newPage();
  }
}

async function releasePage(page){
  if(page){
    await page.close();
    runningThreads --;
  }
}

async function crawlUrls(){
  const page = await getPage();
  if(page){
    const urlObject = await datastore.getUncrawledUrl(domainConfig.domain);
    if(urlObject){
      crawlUrl(page, urlObject);
      // Recur
      setTimeout(crawlUrls, 100);
    } else {
      releasePage(page);
    }
  }
}

async function crawlUrl(page, urlObject){
  hud.urlState(urlObject.url, 'Parsing');
  try {
    /* Blocking images
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.resourceType === 'image')
        request.abort();
      else
        request.continue();
    });
    */
    const response = await page.goto(urlObject.url, { waitUntil: 'networkidle' });
    const html = await page.content();
    // Webgraph Basics
    urlObject.status = response.status;
    urlObject.hash = md5(html);
    urlObject.links = await page.evaluate(function(){ // ...this runs in the context of the browser
      let links = [... document.querySelectorAll('a')];
      return links.map(function(link){
        return link.href;
      });
    });
    // Screenshot
    // const filename = sanitize(urlObject.url);
    // await page.screenshot({ path: `${__dirname}/../../images/${filename}.png` });
    // Parsing (domain specific)
    if(typeof domainConfig.parse === 'function'){
      await injectJQuery(page);
      urlObject.data = await domainConfig.parse(page, urlObject);
    }
    // Save
    await datastore.updateUrl(domainConfig, urlObject);
  } catch(e) {
    // Log errors
    hud.error(e);
  } finally {
    // Always tidy up
    hud.urlState(urlObject.url, false);
    await releasePage(page);
    // Spawn more crawlers
    crawlUrls();
  }
}




async function injectJQuery(page){
  await page.evaluate(() => {
    var jq = document.createElement("script")
    jq.setAttribute('type','text/javascript');
    jq.src = "https://code.jquery.com/jquery-3.2.1.min.js"
    return new Promise((resolve) => {
      jq.addEventListener("load", ()=> {
        resolve();
      });
      document.getElementsByTagName("head")[0].appendChild(jq);
    });
  })
  const watchDog = page.waitForFunction('window.jQuery !== undefined');
  await watchDog;
}





let pausedThreads;
function increaseThreads(){
  maxThreads ++;
  crawlUrls();
  hud.message(`Max: ${maxThreads} threads`);
}
function decreaseThreads(){
  maxThreads --;
  hud.message(`Max: ${maxThreads} threads`);
}
function pause(){
  pausedThreads = maxThreads;
  maxThreads = 0;
  hud.keyboard.assign('p', unpause, 'Unpause');
  hud.message('Paused. Wait for threads to complete');
}
function unpause(){
  maxThreads = pausedThreads;
  crawlUrls();
  hud.keyboard.assign('p', pause, 'Pause');
  hud.message(`Unpaused. Max: ${maxThreads} threads`);
}
