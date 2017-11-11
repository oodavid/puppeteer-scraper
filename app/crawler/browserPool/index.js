// USE BLUEBIRD POOLS!!
//  http://bluebirdjs.com/docs/api/promise.using.html
//  https://www.npmjs.com/package/promise-mysql#usingdisposer-pattern-with-pool


// SPLIT OUT LOGIC (if sensible)


exports.setPoolSize = setPoolSize;
exports.adjustPoolSize = adjustPoolSize;
exports.getIdleCount = getIdleCount;
exports.getBrowser = getBrowser;
exports.releaseBrowser = releaseBrowser;

const puppeteer = require('puppeteer');

let pool = []; // A pool of idle browsers
let size = 1; // The maximum pool size
let running = 0; // The number of browsers currently active

// Set the pool size
function setPoolSize(newSize){
  size = newSize < 1 ? 1 : newSize;
  console.log(`browserPool: size = ${size}`);
}

// Adjust the pool size
function adjustPoolSize(num){
  setPoolSize(size + num);
}

// Return the number of idle browsers
function getIdleCount(){
  return size - running;
}

// Return a browser instance from the pool, or newly created, as necessary
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

// Release a browser back into the pool
async function releaseBrowser(browser){
  running --;
  pool.push(browser);
  await gcBrowsers();
}

// Close surplus browsers
async function gcBrowsers(){
  console.log('browserPool: garbage collection');
  let surplus = pool.length + running - size;
  for(var b=0,bl=pool.length; b<bl; b++){
    if(surplus > 0){
      console.log('browserPool: garbage collection: remove from pool');
      surplus --;
      const browser = pool.pop();
      await browser.close();
    }
  }
}
