module.exports = error;


const writeLine = require('./writeLine.js');
const fs = require('fs');


const errorLog = fs.createWriteStream(`${__dirname}/../../error.log`, { flags: 'a' });
let errors = 0;
function error(e){
  // Write to file
  const now = new Date();
  errorLog.write(`${now}\n${e.stack}\n\n`);
  // Update the HUD
  errors ++;
  writeLine(19, `^-./error.log - ^:^r${errors} new errors^- - latest: ${now}`);
}
