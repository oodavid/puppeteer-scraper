module.exports = urlState;


const writeLine = require('./writeLine.js');
const term = require('terminal-kit').terminal;


let firstLine = 6;
let numLines = 10;


let allUrls = {}; // url: state
let visibleUrls = new Array(numLines).fill(null); // url


function urlState(url, state){
  var index = getVisibleIndex(url);
  if(state){
    allUrls[url] = state;
    if(index !== -1){
      visibleUrls[index] = url;
      let paddedState = (state+'                  ').substr(0, 11); // Fixed length
      writeLine(index+firstLine, `^-${paddedState}^: ${url}`);
    }
  } else {
    delete allUrls[url];
    if(index !== -1){
      visibleUrls[index] = null;
      writeLine(index+firstLine, '^--------     http://----.--^:');
    }
  }
  renderTotals();
}


// Returns the line that this url is already allocated to, or the first empty line (or -1)
function getVisibleIndex(url){
  const index = visibleUrls.indexOf(url);
  if(index !== -1){
    return index;
  }
  return visibleUrls.indexOf(null);
}


// Render totals
function renderTotals(){
  // Total threads
  const totalThreads = Object.keys(allUrls).length;
  let message = `^-${totalThreads} threads`;
  // Hidden threads
  const hiddenThreads = totalThreads - visibleUrls.filter(Boolean).length;
  if(hiddenThreads > 0){
    message += ` (${hiddenThreads} threads are hidden)`;
  }
  writeLine(numLines+firstLine, message);
}
