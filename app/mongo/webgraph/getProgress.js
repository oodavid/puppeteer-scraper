module.exports = getProgress;


const getDb = require('../getDb.js');
const hud = require('../../hud/');


async function getProgress(){
  try {
    const db = await getDb();
    return {
      crawled: 123,
      total: 234,
    };
  } catch (e){
    hud.error(e);
  }
}