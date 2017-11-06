exports.setPoolSize = setPoolSize;
exports.adjustPoolSize = adjustPoolSize;
exports.getIdleCount = getIdleCount;
exports.getBrowser = getBrowser;
exports.releaseBrowser = releaseBrowser;

// Set the pool size
function setPoolSize(newSize){
}

// Adjust the pool size
function adjustPoolSize(num){
}

// Return the number of idle browsers
function getIdleCount(){
}

// Return a browser instance from the pool, or newly created, as necessary
async function getBrowser(){
}

// Release a browser back into the pool
async function releaseBrowser(browser){
}

// Close surplus browsers
async function garbageCollection(){
}
