# MongoDB

Don't run MongoDB locally, a decentralised database is more useful; a managed service is often easier.

There is a free tier on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) that gives you:

* Shared RAM
* 512MB Storage
* Max Connections: 100
* Networking Performance: Low
* Max Databases: 100
* Max Collections: 500

# Setup

Once you've created a remote database (above), run this command to set up your collection indexes.

```shell
node app/mongo/setup/index.js
```

You can update this script to add more collections and indexes, as you see fit.

The script will prompt you for your [MongoDB Connection String](https://docs.mongodb.com/manual/reference/connection-string/), this will be saved to `creds.json`, and is in the format:

`mongodb://[username:password@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[database][?options]]`

## Webgraph Data Structure

We have one collection to represent the webgraph; `urls`.

Each document will have the basic structure below, with indexes on:

* url (unique)
* domain, status
* hash

```json
{
  _id: 'MongoObjectId',
  url: 'http://example.com/scraped-url',
  domain: 'example.com',
  status: 200,
  hash: '865A922C002FCA69CF14B0818FCBEB05',
  html: '<!DOCTYPE html><html lang="en"><head><title>....',
  links: [
    'http://example.com/about-us',
    'http://example.com/contact',
    'http://blog.example.com/',
    'http://otherdomain.com/home'
  ]
}
```

### References

* https://docs.mongodb.com/v2.8/tutorial/create-an-index/
* http://thecodebarbarian.com/common-async-await-design-patterns-in-node.js.html