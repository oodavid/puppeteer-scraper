# Pup

<p align="center">
  <img src="https://user-images.githubusercontent.com/46879/32921897-7150d848-cb27-11e7-9a79-cd65b913290b.gif" alt="Demonstrating the Puppeteer Scraper">
</p>

Rough Todo

When doing "from memory" it really should be "existing promise" for multithreading

Always use `module.exports`, not `exports`


# Northstar - Scrape for Paul!

What remains (15th Nov)

* [x] `updateUrl.js` - 1hr
* [x] `browserPool.js` review - 2hr
    * ...conclusion, I don't need my own browserPool, each puppeteer instance has `pages` (ala tabs)
* [x] MD5 Logic
* [x] DB - Rename `host` to `domain`
* [x] Progress Bar
    * [x] Update periodically
    * [x] Add time estimate
* [x] Ignore #hashes in URLs
* [ ] Switch back to MongoDB, MySQL is irking me
    * [x] Args + Connect
    * [x] Setup Script
    * [ ] Reimplement webgraph logic
* [ ] Implement parsing
    * [ ] Database structure (Mongo, or MySQL)
    * [ ] Logic

--

* [ ] Upon boot
    * [ ] Extra prompt - reset database?
    * [ ] Extra prompt - reset wip?
* [ ] Screenshot
    * [ ] Upload to S3
    * [ ] Save to DB
* [ ] Review `domain settings` files
* [ ] `hud.message()` should make sure messages are one-line and write excess to a file (like errors)
    * [ ] consider using a common file for logic

--

* [x] `app/mysql/index.js`
    * [x] Pool, Connect, Query
    * [x] Return some mysql interface (3rd party)
    * [ ] BONUS - Dump useful error if we can't connect
* [x] `app/crawler/index.js`
    * [x] `init(browser)`
* [ ] Send notification (SMS) when complete
* [ ] Write about URL structure, use this as a reference:
    * [ ] https://developer.mozilla.org/en-US/docs/Web/API/Location
* [x] Create a HUD
    * [x] Use https://github.com/cronvel/terminal-kit
    * [x] initialize - reserve space for the hud
    * [x] title - set title in terminal and HUD
    * [x] keyboard - handle `n` keyboard callbacks, render them on HUD
    * [x] progress - show the overall progress
    * [x] urlState - show the running threads (might rename)
    * [x] message - render short message on HUD
    * [x] error - for handling errors - write to file, render short message on HUD
* [x] Hash MD5 logic
    * [ ] BONUS - Consider adding this to the domain settings (it may want to exclude non-content html)
* [ ] Bonus - Create an executable - https://github.com/zeit/pkg
* [ ] Consider using `scrapy style pipelines` - https://doc.scrapy.org/en/latest/topics/item-pipeline.html



# Reading List

Read these for reference and notes


* https://www.quora.com/What-are-examples-of-how-real-businesses-use-web-scraping-Are-there-any-types-of-businesses-which-use-this-more-than-others
* Turbocharge the data with:
    * https://www.integrationsjs.com/
    * https://open.blockspring.com/browse
    * https://www.blockspring.com/
    * https://hunter.io/
* Test sites:
    * http://webscraper.io/test-sites
    * http://airbnb.com
* https://www.google.com/intl/bn/insidesearch/howsearchworks/crawling-indexing.html
* https://hexfox.com/p/scrapy-vs-beautifulsoup/
* https://hexfox.com/p/how-to-filter-out-duplicate-urls-from-scrapys-start-urls/
* https://stackoverflow.com/a/9736414/1122851 - database pools (and pools in general)

Other course ideas

* Massively Multiplayer Online Scrabble / Upwords
* Games > Grid
* Learn CSS by creating a framework
* SASS
* MongoDb
* CouchDb
* DropKick (Chrome extension)
* Gulp Build System
* Exercise App
* Inverse Kinematics (Pure JS and / or React Native)

# A Better Scraper, with Puppeteer

Firstly, go forth and read [Getting started with Puppeteer and Chrome Headless for Web Scraping](https://medium.com/@e_mad_ehsan/getting-started-with-puppeteer-and-chrome-headless-for-web-scrapping-6bf5979dee3e).

Now we will scale this idea up by:

* Adding multi-threading, proxies and throttling
* Allowing workers to be distributed
* Catering for multiple domains
* Allowing our data to be analysed after-the-fact

# Requirements

* [ ] Data is decentralised
    * [ ] Use FireBase, it's vogue and I'm keen
* [ ] Workers are distributed
    * [ ] Prevent working at cross purposes
    * [ ] Track name and IP
    * [ ] Optional authentication
* [ ] Users can select which domain to scrape
* [x] Users can control how many threads they run
    * [x] Keyboard control
* [ ] Can use proxies
* [ ] Has IP throttling

# Components

Having a clear separation of concerns will keep the system simple and workable.

The scraper should be broken down into the following parts.

## 1 - Create The Webgraph

This can be thought of as a virtual surfer. She will surf the web, clicking all links, submitting all forms and documenting her findings.

* Deals with authentication
* Navigates between pages
* Evaluates javascript
* Builds lists of links
* Follows links / submits forms
* Takes screenshots (they're useful)

The effect of this would be to create a Webgraph, stored in a database, of this structure:

* The nodes
    * Represent URLs
    * Contains a key denoting the "state" of the URL (none > wip > scraped > analysed)
    * Contains the URL and HTML (after javascript has run)
    * Contains the date the URL was scraped
    * Unsolved
         * How to represent pages which have the same URL but different "context"? (session, or POST data)
* The edges
    * Represents links between nodes

You could use this data to create a "PageRank", if you so wished.

## 2 - Page Analysis

Loads an URL that is `scraped` (ie: `unanlysed`)
Load the analysis rules for the URL (see section #3 below)
Parse the HTML into useful data (users, organizations, whatever)

## 3 - Management Interface

At first this will not be necessary, config. can be filebased and analysis direct on the database.

* Visualisation
    * Active Scrapers
    * Results Overview
    * Results Drilldown
* Management
    * Add domains
    * Add domain rules
        * DOM selectors
        * URL weights (0-1)
            * A weight of `0` would mean **don't visit this URL**
            * A weight of `1` would mean **visit this URL ASAP**
    * Trigger Re-Analysis

# Tools

## Headless Browser

**Puppeteer** is now the obvious choice.

## Database

**CouchDB** gives versioning out of the box
**CouchDB** + PouchDB means our visualisations can be realtime

**Firebase Firestore** does the same, with zero "setup"

#### References

* https://github.com/GoogleChrome/puppeteer
* https://github.com/emadehsan/thal
* https://github.com/Quramy/angular-puppeteer-demo
