module.exports = upsertNewUrls;


const parseUrl = require('url').parse;
const getDb = require('../getDb.js');
const hud = require('../../hud/');


async function upsertNewUrls(urls){
  try {
    const db = await getDb();
    // Insert the URLs
    const options = {
      ordered: false, // This means that, when a single write fails, the operation continues with the remaining writes
    };
    let docs = parseUrlsIntoMongoDocs(urls);
    if(docs.length){
      await db.collection('urls').insertMany(docs, options);
    }
  } catch (e){
    // Ignore errors relating to duplicates
    if(!(e.name === 'MongoError' && e.code === 11000)){
      hud.error(e);
    }
  }
}


function parseUrlsIntoMongoDocs(urls){
  // Only HTTP (and HTTPS)
  urls = urls.filter(function(link){
    return link.indexOf('http') === 0;
  });
  // Strip hashes
  urls.forEach(function(value, index, arr){
    arr[index] = value.split('#')[0];
  });
  // Make sure the urls are unique
  urls = [... new Set([... urls])];
  // Convert to MongoDb documents
  urls = urls.map(function(url){
    return {
      url,
      domain: parseUrl(url).host, // Extract the domain
      created: new Date()
    };
  })
  // Done
  return urls;
}
