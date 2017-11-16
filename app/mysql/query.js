module.exports = query;


const Promise = require('bluebird');
const mysql = require('promise-mysql');
const args = require('../args/index.js');


let pool;


async function query(sql, values){
  return await Promise.using(getConnection(), function(connection) {
    return connection
      .query(sql, values);
  });
}


async function getConnection(){
  const pool = await getPool();
  return pool
    .getConnection()
    .disposer(function(connection) {
      pool.releaseConnection(connection);
    });
}


async function getPool() {
  // From memory
  if(pool){
    return pool;
  }
  // Create the pool from settings
  let settings = await args.getMysqlSettings();
  settings.multipleStatements = true;
  pool = mysql.createPool(settings);
  return pool;
}
