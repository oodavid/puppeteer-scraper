MySQL (localhost) installation
  1 - Go here
    https://dev.mysql.com/downloads/mysql/
  ...
  n - After running the installer you will see a message like this:
> A temporary password is generated for root@localhost: abcd1234ABCD
> If you lose this password, please consult the section How to Reset the Root Password in the MySQL reference manual.
    ...make note of the password!
  n - Test it is running with
    `mysqladmin -u root version`

Creating our database

```
mysql -u root
---
CREATE DATABASE scraper;
CREATE USER 'charlotte'@'localhost' IDENTIFIED BY 'Wilbur';
GRANT ALL PRIVILEGES ON scraper.* TO 'charlotte'@'localhost' WITH GRANT OPTION;
exit
--
mysql -u charlotte -p -D scraper
SELECT DATABASE();
exit
```

Workbench installation
  1 - Go here
    https://www.mysql.com/products/workbench/
  2 - Then here
    https://dev.mysql.com/downloads/workbench/
    Select OS and click download
  3 - No need to register;
    No thanks, just start my download.
