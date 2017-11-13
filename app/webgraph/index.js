exports.upsertSeedUrls = require('./upsertSeedUrls.js');
exports.getUncrawledUrl = require('./getUncrawledUrl.js');


/*
  storeLinks(url, links)

    Create new URLs

      INSERT INTO `urls` (`url`)
      VALUES ('http://oodavid.com/a'),
             ('http://oodavid.com/b'),
             ('http://oodavid.com/c'),
             ('http://oodavid.com/d');

    Link the current URL to the new URLs

      DELETE FROM `links` WHERE `url` = 'http://oodavid.com';

      INSERT INTO `link` (`url`, `link`)
      VALUES ('http://oodavid.com', http://oodavid.com/a'),
             ('http://oodavid.com', http://oodavid.com/b'),
             ('http://oodavid.com', http://oodavid.com/c'),
             ('http://oodavid.com', http://oodavid.com/d')

  getUncrawledUrl()

    https://github.com/mysqljs/mysql#transactions

    ...something like this

      START TRANSACTION;
        SELECT @url := `url`, `url`, `status` FROM `url` WHERE `status`='uncrawled' FOR UPDATE; -- innoDb locking read
        UPDATE `urls` SET `status`='processing', `date`=NOW() WHERE `url`=@url; -- update
      COMMIT;


*/
