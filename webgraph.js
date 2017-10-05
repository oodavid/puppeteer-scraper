const browserPool = require('./browserPool.js');
const sanitize = require("sanitize-filename");

let unscraped = [
  'https://oodavid.com',
  'https://oodavid.com/todo/',
  'https://oodavid.com/about-me/',
  'https://oodavid.com/article/angularjs-meta-tags-management/',
  'https://oodavid.com/article/jekyll-is-dead-long-live-hugo/',
  'https://oodavid.com/article/angularjs-meta-tags-management/',
  'https://oodavid.com/article/style-rendering-test/',
];

spawnBrowsers();

function spawnBrowsers(){
  let numSpawned = 0;
  for(var b=0; b<=browserPool.getIdleCount(); b++){
    const url = getUnscrapedUrl();
    if(url){
      spawnBrowser(url);
      numSpawned++;
    }
  }
  if(!numSpawned){
    console.log('nothing to do (start exponential backoff)');
  }
};

async function spawnBrowser(url){
  console.log('parsing', url);
  let browser;
  try {
    browser = await browserPool.getBrowser();
    const page = await browser.newPage();
    await page.goto(url);
    // Analysis
    const filename = sanitize(url);
    await page.screenshot({ path: `screenshots/${filename}.png` });
    const html = await page.content();
  } catch(e) {
    console.error(e);
  }
  // Always release the browser
  await browserPool.releaseBrowser(browser);
  spawnBrowsers();
}

function getUnscrapedUrl(){
  return unscraped.shift();
}
