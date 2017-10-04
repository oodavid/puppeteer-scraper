const puppeteer = require('puppeteer');

(async () => {

    console.time('puppeteer.launch');
    const browser = await puppeteer.launch();
    console.timeEnd('puppeteer.launch');

    console.time('browser.newPage');
    const page = await browser.newPage();
    console.timeEnd('browser.newPage');

    console.time('page.goto');
    await page.goto('https://oodavid.com/article/angularjs-memento-factory/');
    console.timeEnd('page.goto');

    console.time('page.screenshot');
    await page.screenshot({ path: 'screenshots/oodavid.com.png' });
    console.timeEnd('page.screenshot');

    console.time('page.content');
    const html = await page.content();
    console.timeEnd('page.content');

    await browser.close();

})();
