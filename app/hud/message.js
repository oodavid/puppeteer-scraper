module.exports = message;


const writeLine = require('./writeLine.js');
const fs = require('fs');


const messageLog = fs.createWriteStream(`${__dirname}/../../message.log`, { flags: 'a' });
let timeoutId;


function message(message, duration=5000){
  // Write to file
  const now = new Date();
  messageLog.write(`${now} - ${message}\n\n`);
  // Update the HUD
  writeLine(18, message);
  if(timeoutId){
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(function(){
    writeLine(18, '');
  }, duration);
}
