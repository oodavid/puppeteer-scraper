module.exports = updateUrl;


const hud = require('../hud/');
const mysql = require('../mysql/');
const parseUrl = require('url').parse;


// Where urlObject is an object of format { id, status, html, hash, links }
async function updateUrl(domainConfig, urlObject){
  // Build up our SQL statement and values
  let sql = '';
  let values = [];
  // Run the query
  try {
    // Update the URL itself
    sql += 'UPDATE urls SET status = ?, html = ?, hash = ?, updated = NOW() WHERE id = ?;';
    values.push(... [ urlObject.status, urlObject.html, urlObject.hash, urlObject.id ]);
    // Create the links
    const links = parseLinks(urlObject.links);
    links.forEach(function(link){
      const domain = parseUrl(link).host;
      if(domain){
        sql += 'INSERT INTO urls (domain, url) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id;';
        values.push(... [ domain, link ]);
        sql += 'INSERT IGNORE INTO links (from_url_id, to_url_id) VALUES (?, (SELECT id FROM urls WHERE url=? LIMIT 1));';
        values.push(... [ urlObject.id, link ]);
      }
    });
    await mysql.query(sql, values);
  } catch(e){
    hud.error(e);
    hud.error(new Error(sql));
    hud.error(new Error(JSON.stringify(values, null, 2)));
  }
}


function parseLinks(links){
  // Only HTTP (and HTTPS)
  links = links.filter(function(link){
    return link.indexOf('http') === 0;
  });
  // Strip hashes
  links.forEach(function(value, index, arr){
    arr[index] = value.split('#')[0];
  });
  // Make sure the links are unique
  links = [... new Set([... links])];
  return links;
}
