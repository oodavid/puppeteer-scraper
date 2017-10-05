const puppeteer = require('puppeteer');
const sanitize = require("sanitize-filename");

let puppets = {
  running: 0,
  max: 2,
};

let unscraped = [
  'https://oodavid.com',
  'https://oodavid.com/todo/',
  'https://oodavid.com/about-me/',
  'https://oodavid.com/article/angularjs-meta-tags-management/',
  'https://oodavid.com/article/jekyll-is-dead-long-live-hugo/',
  'https://oodavid.com/article/angularjs-meta-tags-management/',
  'https://oodavid.com/article/style-rendering-test/',
];

spawnPuppets();

function spawnPuppets(){
  for(var p=puppets.running; p<puppets.max; p++){
    const url = getUnscrapedUrl();
    if(url){
      spawnPuppet(url);
    }
  }
};

async function spawnPuppet(url){
  console.log('parsing', url);
  puppets.running ++;
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    // Analysis
    const filename = sanitize(url);
    await page.screenshot({ path: `screenshots/${filename}.png` });
    const html = await page.content();
    // End Analysis
    await browser.close();
    puppets.running --;
    spawnPuppets();
  } catch(e) {
    console.error(e);
    puppets.running --;
  }
}

function getUnscrapedUrl(){
  return unscraped.shift();
}
