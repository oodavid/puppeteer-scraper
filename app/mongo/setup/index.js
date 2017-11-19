const getDb = require('../getDb.js');


async function setup(){
  try {
    const db = await getDb();
    await db.collection('urls').createIndex({ url: 1 }, { unique: true });
    await db.collection('urls').createIndex({ domain: 1, status: 1 });
    await db.collection('urls').createIndex({ hash: 1 });
    db.close();
    console.log('Mongo Setup Complete (you only need to run this once)');
  } catch (e){
    console.log(e);
  }
}


setup();
