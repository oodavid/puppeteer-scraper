module.exports = updateUrl;


const getDb = require('../getDb.js');
const upsertNewUrls = require('./upsertNewUrls.js');
const hud = require('../../hud/');


// Where urlObject is an object of format { _id, url, domain, status, html, hash, links, data }
async function updateUrl(domainConfig, urlObject){
  try {
    const db = await getDb();
    // Update the object
    urlObject.updated = new Date();
    const filter = { _id: urlObject._id };
    const update = { $set: urlObject };
    await db.collection('urls').updateOne(filter, update);
    // Upsert the links
    await upsertNewUrls(domainConfig, urlObject.links);
  } catch (e){
    hud.error(e);
  }
}
