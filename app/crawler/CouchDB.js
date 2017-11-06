const Promise = require('bluebird');
const CREDS = require('../creds.js').CouchDb;
const nano = require('nano')(`${CREDS.protocol}://${CREDS.username}:${CREDS.userpass}@${CREDS.host}:${CREDS.port}`);


var webgraphDb = nano.db.use('webgraph');
Promise.promisifyAll(webgraphDb);


exports.getUnscrapedUrls = getUnscrapedUrls;
exports.setScrapeData = setScrapeData;


// Promise to return `num` URLs
// Flag said URLs as `queued`
async function getUnscrapedUrls(num){
  const docs = await webgraphDb.viewAsync('pages', 'unscraped', { limit: num });
  // Update the docs
  let updatedDocs = docs.rows.map((doc) => {
    doc.key.status = 'queued';
    return doc.key;
  });
  const bulkResults = await webgraphDb.bulkAsync({ docs: updatedDocs });
  // Review the update
  for(var b=bulkResults.length-1; b>=0; b--){
    const bulkResult = bulkResults[b];
    if(bulkResult.error){
      updatedDocs.splice(b, 1); // Remove any docs that couldn't be flagged as `queued` (likely due to conflicts)
    } else {
      updatedDocs[b]._rev = bulkResult.rev; // Update the _rev of those that could
    }
  }
  // Make sure the url is a property
  updatedDocs.forEach(function(doc){
    doc.url = doc._id;
  });
  // Return
  return updatedDocs;
}


// Promise to update the URL status, html and screenshot
// add links add new urls to database
async function setScrapeData(doc, html, status_code, links){
  // Update the doc
  delete doc.url;
  doc.status = 'scraped';
  doc.html = html;
  doc.status_code = status_code;
  doc.links = {};
  links.forEach(function(o){
    doc.links[o] = true;
  });
  // Update
  await webgraphDb.insertAsync(doc);
  // Create the link URLs
  let docs = links.map(function(link){
    return { _id: link };
  });
  await webgraphDb.bulkAsync({ docs: docs });
  // Make sure the url is a property
  doc.url = doc._id;
  // Return
  return doc;
}


// Test out the commands
//
(async () => {
  // Read a batch of URLs
  console.log(`Getting Unscraped URLs`);
  const docs = await getUnscrapedUrls(1);
  console.log(docs);

  // Scrape an URL
  const doc = docs[0];
  console.log(`Scraping ${doc.url} (demo)`);
  const html = '<h1>Hello World</h1>';
  const status_code = 200;
  const links = [
    'https://oodavid.com/testing/',
    'https://oodavid.com/testing-123/',
  ];
  const updatedDoc = await setScrapeData(doc, html, status_code, links);
  console.log(updatedDoc);
})();
