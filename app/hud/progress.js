module.exports = progress;


const numLines = require('./numLines.js');
const initOnce = require('./initOnce.js');
const term = require('terminal-kit').terminal;
const moment = require('moment');


let session;
let maxHistoryMs = 1*60*1000; // 1 minute


function progress(completed, total){
  initOnce();
  calculateSessionTotals(completed, total);
  showProgressMeter();
  showVelocityAndEta();
}


function calculateSessionTotals(completed, total){
  const now = Date.now();
  let props = { completed, total, timestamp: now };
  if(!session){
    session = {
      started: now,
      initial: props,
      history: [],
    };
  }
  // Basics
  session.completed = props.completed;
  session.total = props.total;
  session.timestamp = now;
  session.duration = now - session.initial.timestamp;
  session.addedToTotal = total - session.initial.total;
  session.newlyCompleted = completed - session.initial.completed;
  session.remaining = total - completed;
  session.pctComplete = total ? (completed/total) : 0;
  // Manage history
  session.history.push(props);
  session.history = session.history.filter(function(item){
    return item.timestamp > (now - maxHistoryMs); // Trim older history items
  });
  // Velocity (time to complete one item, ms) - compare the oldest and newest history items
  const dTimestamp = props.timestamp - session.history[0].timestamp;
  const dCompleted = props.completed - session.history[0].completed;
  session.velocity = false;
  if(dCompleted > 0){
    session.velocity = (dTimestamp/dCompleted);
  }
  // Eta (time to complete the remaining items, ms)
  session.eta = false;
  if(session.velocity){
    session.eta = new Date(now+(session.remaining*session.velocity));
  }
}


// Progress [---------------------------------------------------------------------] 1% [362 / 27,534]
function showProgressMeter(){
  // The meter
  var len = 70;
  var left = Array(Math.round(len*session.pctComplete)).join('=');
  var right = Array(1+len-Math.round(len*session.pctComplete)).join('-');
  var completed = session.completed.toLocaleString();
  var total = session.total.toLocaleString();
  // The string
  var pctStr = Math.floor(session.pctComplete * 100);
  var str = `Progress [^g${left}^:^-${right}^:] ${pctStr}% [^g${completed}^: / ${total}]`;
  // Output
  term.restoreCursor();
  term.column(0).move(0, 3-numLines).eraseLine();
  term(str);
  term.restoreCursor();
}


// Completed: 1,234, Velocity: 100 / hour, ETA: 2h 40
function showVelocityAndEta(){
  const completed = session.newlyCompleted.toLocaleString();
  var ttc = '---';
  if(session.eta){
    ttc = moment().to(moment(session.eta), true);
  }
  var rate = '---';
  if(session.velocity){
    rate = Math.round((60*60*1000)/session.velocity).toLocaleString() + ' / hour';
  }
  var str = `Completed: ${completed}, Rate: ${rate}, TTC: ${ttc}`;
  // Output
  term.restoreCursor();
  term.column(0).move(0, 4-numLines).eraseLine();
  term(str);
  term.restoreCursor();
}
