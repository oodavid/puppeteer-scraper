module.exports = query;


const Promise = require('bluebird');
const mysql = require('promise-mysql');
const args = require('../args/index.js');


let pool;


async function query(sql){
  const pool = await getPool();
  return await Promise.using(getConnection(), function(connection) {
    return connection
      .query(sql);
  });
}


async function getPool() {
  // From memory
  if(pool){
    return pool;
  }
  // Create the pool from settings
  const settings = await args.getMysqlSettings();
  pool = mysql.createPool(settings);
  return pool;
}


async function getConnection(){
  const pool = await getPool();
  return pool
    .getConnection()
    .disposer(function(connection) {
      pool.releaseConnection(connection);
    });
}
