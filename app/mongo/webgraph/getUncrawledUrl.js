module.exports = getUncrawledUrl;


const getDb = require('../getDb.js');
const hud = require('../../hud/');


async function getUncrawledUrl(){
  try {
    const db = await getDb();
    // Logic here
  } catch (e){
    hud.error(e);
  }
}