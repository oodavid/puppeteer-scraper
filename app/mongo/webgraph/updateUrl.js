module.exports = updateUrl;


const getDb = require('../getDb.js');
const hud = require('../../hud/');


async function updateUrl(){
  try {
    const db = await getDb();
    // Logic here
  } catch (e){
    hud.error(e);
  }
}