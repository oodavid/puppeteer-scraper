module.exports = urlState;


const writeLine = require('./writeLine.js');
const term = require('terminal-kit').terminal;


let firstLine = 5;
let numLines = 10;


let allUrls = {}; // url: state
let visibleUrls = new Array(numLines).fill(null); // url


function urlState(url, state){
  var index = getVisibleIndex(url);
  if(state){
    allUrls[url] = state;
    if(index !== -1){
      visibleUrls[index] = url;
      let trimmedUrl = url.substring(0, 50); // Max length
      let paddedState = (state+'                  ').substr(0, 11); // Fixed length
      writeLine(index+firstLine, `${paddedState} ${trimmedUrl}`);
    }
  } else {
    delete allUrls[url];
    if(index !== -1){
      visibleUrls[index] = null;
      writeLine(index+firstLine, '^K-------     http://----.--^:');
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
  // Total processes
  const totalProcesses = Object.keys(allUrls).length;
  writeLine(numLines+firstLine+1, `Processes: ${totalProcesses}`);
  // Hidden processes
  const hiddenProcesses = totalProcesses - visibleUrls.filter(Boolean).length;
  if(hiddenProcesses > 0){
    writeLine(numLines+firstLine, `^K... ${hiddenProcesses} more processes running^:`);
  }
  // console.log(visibleUrls);
}
