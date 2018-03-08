const pp = require('puppeteer');

const sleep = time => new Promise((resolve) => {
  setTimeout(resolve, time);
})

;(async () => {
  const browser = await pp.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.tracing.start({ path: './trace.json' });
  await page.goto('https://www.jd.com/', { waitUntil: 'networkidle2' });
  await page.tracing.stop();
  await sleep(3000)

  await page.screenshot({ path: 'example.png' });

  await browser.close();


})()