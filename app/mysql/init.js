module.exports = init;


const query = require('./query.js');
const term = require('terminal-kit').terminal;


async function init(){
  let rows = await query('SELECT DATABASE() AS db, USER() AS user;');
  term(`^r❯^: Connected to ^c${rows[0]['db']}^: with ^c${rows[0]['user']}^:\n`);
}
