module.exports = getUncrawledUrl;


const getDb = require('../getDb.js');
const hud = require('../../hud/');


async function getUncrawledUrl(domain){
  try {
    const db = await getDb();
    // Get an URL with no status, update it, and return
    const filter = { status: { $exists: false }, domain: domain };
    const update = { $set: { status: 'wip' } };
    const options = { returnNewDocument: true, sort: { weight: -1 } };
    const response = await db.collection('urls').findOneAndUpdate(filter, update, options);
    return response.value; // This may be null!
  } catch (e){
    hud.error(e);
  }
}
