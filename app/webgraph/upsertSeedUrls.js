module.exports = upsertSeedUrls;


const mysql = require('../mysql/');


async function upsertSeedUrls(domain, seedUrls){
  // The `query` module needs `values` in a specific format to trigger a bulk insert, see: https://stackoverflow.com/a/14259347/1122851
  let values = [
    seedUrls.map(function(url){
      return [ domain, url ];
    })
  ];
  return await mysql.query('INSERT INTO urls (domain, url) VALUES ? ON DUPLICATE KEY UPDATE id=id;', values);
}
