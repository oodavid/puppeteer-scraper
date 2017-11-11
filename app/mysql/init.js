module.exports = init;


const query = require('./query.js');
const printMessage = require('../messages/printMessage.js');


async function init(){
  let rows = await query('SELECT DATABASE() AS db;');
  printMessage(`Database: Connected to "${rows[0]['db']}"`);
}
