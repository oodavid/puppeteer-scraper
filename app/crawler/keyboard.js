const keypress = require('keypress');
const browserPool = require('./browserPool.js');

// Force `process.stdin` to emit `keypress` (and `mousepress`) events
keypress(process.stdin);

// Listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
  // Adjust the number of threads
  if(key.name == 'up'){
    browserPool.adjustPoolSize(+1);
  } else if(key.name == 'down'){
    browserPool.adjustPoolSize(-1);
  }
  // We must manually handle the exit command
  if(key && key.ctrl && key.name == 'c'){
    process.exit();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();

console.log('Use [UP] and [DOWN] to change horsepower');
