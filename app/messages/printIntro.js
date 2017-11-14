module.exports = printIntro;


const term = require('terminal-kit').terminal;


function printIntro(){
  term(addSplashOfColor(`
  ∇   ____   ∇
  | :      : |  ·---------------------------- - -
  {| ♥    ♥ |}  | Web Scraper; Crawler and Parser
   |___==___|   |                    oodavid 2017
  /          \\  ·---------------------------- - -
`));
}


function addSplashOfColor(message){
  return message.replace(/([∇♥])/g, `^r$1^:`);
}
