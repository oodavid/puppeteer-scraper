module.exports = init;


const getDb = require('./getDb.js');
const term = require('terminal-kit').terminal;


async function init(){
  try {
    const db = await getDb();
    term(`^r❯^: Connected to MongoDB^:\n`);
  } catch (e){
    console.log(e);
  }
}
