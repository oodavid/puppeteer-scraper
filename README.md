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
* [ ] Users can control how many threads they run
    * [ ] Keyboard control
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
