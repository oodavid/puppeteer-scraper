module.exports = getDb;

const args = require('../args/index.js');
const MongoClient = require('mongodb').MongoClient;


let db;


async function getDb(){
  // Initial connect
  if(!db){
    const connectionString = await args.getMongoConnectionString();
    db = await MongoClient.connect(connectionString);
  }
  // Return from memory
  return db;
}
