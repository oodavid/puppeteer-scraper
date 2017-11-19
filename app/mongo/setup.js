const args = require('../args/index.js');
const MongoClient = require('mongodb').MongoClient;


(async () => {
  try {
    const connectionString = await args.getMongoConnectionString();
    const db = await MongoClient.connect(connectionString);
    await db.collection('urls').createIndex({ url: 1 }, { unique: true });
    await db.collection('urls').createIndex({ domain: 1, status: 1 });
    await db.collection('urls').createIndex({ hash: 1 });
    /*
    
    await db.collection('Movies').insertMany([
      { name: 'Enter the Dragon' },
      { name: 'Ip Man' },
      { name: 'Kickboxer' }
    ]);

    // Don't `await`, instead get a cursor
    const cursor = db.collection('Movies').find();
    // Use `next()` and `await` to exhaust the cursor
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      console.log(doc.name);
    }

    db.close();
    
    */
    db.close();
  } catch (e){
    console.log(e);
  } finally {
    console.log('tidy up');
  }

})();



