module.exports = printIntro;


function printIntro(){
  console.log(addSplashOfColor(`
∇   ____   ∇
| :      : |  ·---------------------------- - -
{| ♥    ♥ |}  | Web Scraper; Crawler and Parser
 |___==___|   |                    oodavid 2017
/          \\  ·---------------------------- - -
`));
}


function addSplashOfColor(message){
  var red = '\033[0;31m';
  var norm = '\033[0m';
  return message.replace(/([∇♥])/g, `${red}$1${norm}`)
}
