# MongoDB

Don't run MongoDB locally, a decentralised database is more useful; a managed service is often easier.

There are services available with a free tier:

* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Free tier
* [MLab](https://mlab.com/) - Sandbox

Each come with a their own limitations, usually around the amount of data that can be stored, number of connections and replication.

Regardless, they're enough for testing and development.

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

# Handy Queries

```js
// Total number of URLs in the system (for any domain)
db.urls.find().count();

// Get the highest priority url to parse
db.urls.find({ status: { $exists: false }, domain: 'www.checkatrade.com' }).sort({ weight: -1 }).limit(1).pretty();

// Get the number of processed URLs
db.urls.find({ status: { $exists: true, $ne: 'wip' }, domain: 'www.checkatrade.com' }).count();

// Get all URLs with data matching JamesPond
db.urls.find({ 'data.id': 'JamesPond' }, { url: 1, domain: 1, data: 1 }).pretty()

// Count the URLs of each state
//  https://docs.mongodb.com/manual/reference/operator/aggregation/sum/#grp._S_sum
db.urls.aggregate([{"$group": {"_id": "$status", "count": {"$sum":1} }}])
```

### References

* https://docs.mongodb.com/v2.8/tutorial/create-an-index/
* http://thecodebarbarian.com/common-async-await-design-patterns-in-node.js.html
