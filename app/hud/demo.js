const hud = require('./');


function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


(async () => {
  // Title
  hud.title('Crawling ^goodavid.com^:');
  // Keyboard bindings
  hud.keyboard.assign('UP', someFunction, 'Increase Threads');
  hud.keyboard.assign('DOWN', someFunction, 'Decrease Threads');
  hud.keyboard.assign('p', pause, 'Pause');
  hud.keyboard.start();
  // Processes
  hud.urlState('http://domain.com/5', 'Loading');
  hud.urlState('http://domain.com/6', 'Loading');
  hud.urlState('http://domain.com/7', 'Loading');
  hud.progress(2, 10);
  await timeout(1000);
  hud.urlState('http://domain.com/6', 'Waiting');
  hud.error(new Error('Whoops!'));
  hud.urlState('http://domain.com/8', 'Loading');
  hud.progress(5, 10);
  await timeout(1000);
  hud.urlState('http://domain.com/5', 'Waiting');
  hud.urlState('http://domain.com/9', 'Loading');
  hud.urlState('http://domain.com/10', 'Loading');
  for(var n=20;n<100;n++){
    hud.urlState(`http://domain.com/${n}`, 'Loading');
  }
  hud.progress(7, 10);
  await timeout(1000);
  hud.urlState('http://domain.com/5', false);
  hud.urlState('http://domain.com/7', 'UPDATED');
  hud.urlState('http://domain.com/9', false);
  hud.error(new Error('Oh dear!'));
  hud.progress(10, 10);
  await timeout(1000);
  hud.urlState('http://domain.com/55', 'Waiting');
  hud.urlState('http://domain.com/56', 'Waiting');
  for(var n=0;n<40;n++){
    hud.urlState(`http://domain.com/${n}`, false);
  }
  hud.urlState('http://domain.com/7', 'UPDATED');
})();




function someFunction(){
  hud.message('Showing a random number '+Math.random());
}
function pause(){
  hud.keyboard.assign('p', unpause, 'Unpause');
  hud.message('Paused - processes will spin down');
}
function unpause(){
  hud.keyboard.assign('p', pause, 'Pause');
  hud.message('Unpaused - processes will spin up');
}
