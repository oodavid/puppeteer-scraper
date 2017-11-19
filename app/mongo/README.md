# MongoDB

Don't bother setting this up locally, a managed service is simpler and more useful.

There is a free tier on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) that gives you:

* Shared RAM
* 512MB Storage
* Max Connections: 100
* Networking Performance: Low
* Max Databases: 100
* Max Collections: 500

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