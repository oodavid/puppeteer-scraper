const getDb = require('../getDb.js');


async function setup(){
  try {
    const db = await getDb();
    // All URLS must be unique
    await db.collection('urls').createIndex({ url: 1 }, { unique: true });
    // Optimizes the query "find urls from domain with status, in weight order"
    await db.collection('urls').createIndex({ domain: 1, status: 1, weight: -1 });
    // Optimizes the query "does this url give a duplicate hash?"
    await db.collection('urls').createIndex({ hash: 1 });
    // Allows us to Map Reduce our scraped data
    await db.collection('urls').createIndex({ 'data.id': 1 });
    // All done
    db.close();
    console.log('Mongo Setup Complete (you only need to run this once)');
  } catch (e){
    console.log(e);
  }
}


setup();
