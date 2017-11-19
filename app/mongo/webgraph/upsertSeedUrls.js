module.exports = upsertSeedUrls;


const parseUrl = require('url').parse;
const getDb = require('../getDb.js');
const hud = require('../../hud/');


async function upsertSeedUrls(seedUrls){
  try {
    const db = await getDb();
    // Parse the URLs and extract the domain for each
    let docs = seedUrls.map(function(url){
      const domain = parseUrl(url).host;
      return { domain, url };
    });
    // Insert options
    const options = {
      ordered: false, // ...when a single write fails, the operation continues with the remaining writes, throw an error
    };
    // Now insert
    await db.collection('urls').insertMany(docs, options);
  } catch (e){
    // Ignore errors relating to duplicate URLs
    if(e.name === 'MongoError' && e.code === 11000){
      // ignore
    } else {
      hud.error(e);
    }
  }
}
