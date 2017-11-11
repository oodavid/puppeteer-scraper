module.exports = getUnscrapedUrls;


const mysql = require('../mysql/');


async function getUnscrapedUrls(num){
  return await mysql.query(`SELECT id, url FROM urls WHERE status IS NULL LIMIT ${num};`);
}
