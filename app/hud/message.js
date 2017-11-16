module.exports = message;


const writeLine = require('./writeLine.js');


let timeoutId;


function message(message, duration=5000){
  writeLine(18, message);
  if(timeoutId){
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(function(){
    writeLine(18, '');
  }, duration);
}
