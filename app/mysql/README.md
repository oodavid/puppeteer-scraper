## MySQL (localhost) installation

  1 - Go here
    https://dev.mysql.com/downloads/mysql/
  ...
  n - After running the installer you will see a message like this:
> A temporary password is generated for root@localhost: abcd1234ABCD
> If you lose this password, please consult the section How to Reset the Root Password in the MySQL reference manual.
    ...make note of the password!
  n - Test it is running with
    `mysqladmin -u root version`

### Automatically Starting

MySQL will automatically start.

You can access the server (on OSX) via **System Preferences**.

https://dev.mysql.com/doc/refman/5.7/en/osx-installation-launchd.html

## Create our user

```
mysql -u root -p
---
CREATE DATABASE scraper;
CREATE USER 'charlotte'@'localhost' IDENTIFIED BY 'Wilbur';
GRANT ALL PRIVILEGES ON scraper.* TO 'charlotte'@'localhost';
FLUSH PRIVILEGES;
exit
--
mysql -u charlotte -p -D scraper
SELECT DATABASE();
exit
```

## Workbench installation

  1 - Go here
    https://www.mysql.com/products/workbench/
  2 - Then here
    https://dev.mysql.com/downloads/workbench/
    Select OS and click download
  3 - No need to register;
    No thanks, just start my download.

Exporting our EER Diagram `File > Export > Forward Engineer SQL CREATE Script`


## Create our database

mysql -u charlotte -p scraper < ./scraper.sql


# Useful statements

```mysql
-- Recently updated URLs
SELECT id, domain, url, status, created, updated, CHAR_LENGTH(html), hash FROM urls WHERE status IS NOT NULL and status != 'wip' ORDER BY updated DESC LIMIT 10;

-- How many URLs per domain
SELECT domain, COUNT(*) FROM urls GROUP BY domain;

-- How many URLs of each status per domain
SELECT domain, status, COUNT(*) FROM urls GROUP BY domain, status ORDER BY COUNT(*) DESC LIMIT 30;

-- Finding duplicate pages for a given domain
SELECT hash, COUNT(*) AS num FROM urls WHERE domain = 'domain.com' AND hash IS NOT NULL GROUP BY hash HAVING num > 1;
```
