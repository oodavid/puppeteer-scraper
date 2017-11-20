module.exports = getProgress;


const getDb = require('../getDb.js');
const hud = require('../../hud/');


async function getProgress(domain){
  try {
    const db = await getDb();
    // Response
    let response = { crawled: 0, total: 0 };
    // Total
    const totalCursor = await db.collection('urls').aggregate([
      { $match: { domain: domain } },
      { $count: "total" }
    ]).toArray();
    response.total = totalCursor.length ? totalCursor[0].total : 0;
    // Crawled
    const crawledCursor = await db.collection('urls').aggregate([
      { $match: { status: { $exists: true, $ne: 'wip' }, domain: domain } },
      { $count: "crawled" }
    ]).toArray();
    response.crawled = crawledCursor.length ? crawledCursor[0].crawled : 0;
    // Return
    return response;
  } catch (e){
    hud.error(e);
  }
}
