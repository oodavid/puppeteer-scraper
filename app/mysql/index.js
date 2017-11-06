exports.getConnection = getConnection;


const args = require('../args/');


async function getConnection(){
  const settings = await args.getMysqlSettings();
  return settings;
  //return await settings.getSettings();
}
