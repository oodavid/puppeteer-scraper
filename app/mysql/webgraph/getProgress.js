module.exports = getProgress;


const mysql = require('../mysql/');


async function getProgress(domain){
  const sql = `
SELECT COUNT(*) as total FROM urls WHERE domain = ?;
SELECT COUNT(*) as crawled FROM urls WHERE domain = ? AND status IS NOT NULL AND status != 'wip';
`;
  const values = [ domain, domain ];
  let rows = await mysql.query(sql, values);
  if(rows && rows[0] && rows[0][0] && rows[1] && rows[1][0]){
    return {
      total: rows[0][0].total,
      crawled: rows[1][0].crawled,
    };
  } else {
    return {
      total: 0,
      crawled: 0,
    };
  }
}
