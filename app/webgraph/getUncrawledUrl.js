module.exports = getUncrawledUrl;


const mysql = require('../mysql/');
const err = require('../hud/error.js');


async function getUncrawledUrl(domain){
  const sql = `
SELECT id, url, @id:=id FROM urls WHERE status IS NULL AND domain = ? LIMIT 1 FOR UPDATE;
UPDATE urls SET status='wip', updated = NOW() WHERE id=@id;
`;
  const values = [ domain ];
  let rows = await mysql.query(sql, values);
  if(rows && rows[0] && rows[0][0] && rows[0][0].id){
    return {
      id: rows[0][0].id,
      url: rows[0][0].url,
    };
  } else {
    return false;
  }
}
