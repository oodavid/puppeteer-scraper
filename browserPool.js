const puppeteer = require('puppeteer');

exports.setPoolSize = setPoolSize;
exports.adjustPoolSize = adjustPoolSize;
exports.getIdleCount = getIdleCount;
exports.getBrowser = getBrowser;
exports.releaseBrowser = releaseBrowser;

let pool = []; // A pool of idle browsers
let size = 1; // The sizeimum number of browsers allowed
let running = 0; // The number of browsers currently active

// Sets the pool size
function setPoolSize(newSize){
  size = newSize < 1 ? 1 : newSize;
  console.log(`browserPool: size = ${size}`);
}

// Adjusts the pool size
function adjustPoolSize(num){
  setPoolSize(size + num);
}

// Returns the number of idle browsers
function getIdleCount(){
  return size - running;
}

// Returns a new browser instance, from the pool, or newly created, as necessary
async function getBrowser(){
  running ++;
  if(pool.length){
    console.log('browserPool: get browser from pool');
    const browser = pool.pop();
    return browser;
  } else {
    console.log('browserPool: create new browser');
    const browser = await puppeteer.launch();
    return browser;
  }
}

// Releases a running browser back to the pool
async function releaseBrowser(browser){
  running --;
  pool.push(browser);
  await gcBrowsers();
}

// Closes surplus browsers
async function gcBrowsers(){
  let surplus = pool.length + running - size;
  for(var b=0,bl=pool.length; b<bl; b++){
    if(surplus > 0){
      console.log('browserPool: closing surplus browser');
      surplus --;
      const browser = pool.pop();
      await browser.close();
    }
  }
}
