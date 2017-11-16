module.exports = updateUrl;


const hud = require('../hud/');
const mysql = require('../mysql/');
const parseUrl = require('url').parse;


async function updateUrl(id, status, html, hash, links){
  // Build up our SQL statement and values
  let sql = '';
  let values = [];

  // Update the URL itself
  sql += 'UPDATE urls SET status = ?, html = ?, hash = ?, updated = NOW() WHERE id = ?;';
  values.push(... [ status, html, hash, id ]);

  // Make sure the links are unique
  links = [... new Set([... links])];
  // Create the links
  let domain;
  links.forEach(link => {
    domain = parseUrl(link).host;
    if(domain){
      sql += 'INSERT INTO urls (domain, url) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id;';
      values.push(... [ domain, link ]);
      sql += 'INSERT IGNORE INTO links (from_url_id, to_url_id) VALUES (?, (SELECT id FROM urls WHERE url=? LIMIT 1));';
      values.push(... [ id, link ]);
    }
  });

  // Run the query
  try {
    await mysql.query(sql, values);
  } catch(e){
    hud.error(e);
    hud.error(sql);
    hud.error(JSON.stringify(values, null, 2));
  }
}
