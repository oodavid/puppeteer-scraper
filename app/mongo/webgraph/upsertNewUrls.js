module.exports = upsertNewUrls;


const parseUrl = require('url').parse;
const getDb = require('../getDb.js');
const hud = require('../../hud/');


async function upsertNewUrls(domainConfig, urls){
  try {
    const db = await getDb();
    // Insert the URLs
    const options = {
      ordered: false, // This means that, when a single write fails, the operation continues with the remaining writes
    };
    let docs = parseUrlsIntoMongoDocs(domainConfig, urls);
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


function parseUrlsIntoMongoDocs(domainConfig, urls){
  return urls
    .filter(function(url){
      return url.match(/^http/i); // Must start with HTTP (case insensitive)
    })
    .map(function(url){
      return url.split('#')[0]; // Strip hashes
    })
    .filter(function(url, index, self){
      return self.indexOf(url) === index; // Only unique URLs
    })
    .map(function(url){
      let weight = 0.5;
      if(typeof domainConfig.getUrlWeight === 'function'){
        weight = domainConfig.getUrlWeight(url);
      }
      return {
        url,
        domain: parseUrl(url).host, // Extract the domain
        weight,
        created: new Date()
      };
    });
}
