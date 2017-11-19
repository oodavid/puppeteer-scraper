const args = require('../args/index.js');
const MongoClient = require('mongodb').MongoClient;


(async () => {
  try {
    const connectionString = await args.getMongoConnectionString();
    const db = await MongoClient.connect(connectionString);
    console.log("Connected successfully to server");
  } catch (e){
    console.log(e);
  } finally {
    console.log('tidy up');
  }

})();
