const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://news.ycombinator.com');

  let content = await page.content();
  var $ = cheerio.load(content);
  $('span.comhead').each(function(i, element){
    var a = $(this).prev();
    var rank = a.parent().parent().text();
    var title = a.text();
    var url = a.attr('href');
    var subtext = a.parent().parent().next().children('.subtext').children();
    var points = $(subtext).eq(0).text();
    var username = $(subtext).eq(1).text();
    var comments = $(subtext).eq(2).text();

    var metadata = {
      rank: parseInt(rank),
      title: title,
      url: url,
      points: parseInt(points),
      username: username,
      comments: parseInt(comments)
    };
    console.log(metadata);
  });

  browser.close();
}

run();