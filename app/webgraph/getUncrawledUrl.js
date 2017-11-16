module.exports = getUncrawledUrl;


const mysql = require('../mysql/');


async function getUncrawledUrl(domain){
  const sql = `
START TRANSACTION READ WRITE;
SELECT id, url, @id:=id FROM urls WHERE status IS NULL AND domain = ? LIMIT 1 FOR UPDATE;
UPDATE urls SET status='wip', updated = NOW() WHERE id=@id;
COMMIT;
`;
  const values = [ domain ];
  let rows = await mysql.query(sql, values);
  if(rows && rows[1] && rows[1][0] && rows[1][0].id){
    return {
      id: rows[1][0].id,
      url: rows[1][0].url,
    };
  } else {
    return false;
  }
}
