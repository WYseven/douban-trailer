const pp = require('puppeteer');

const sleep = time => new Promise((resolve) => {
  setTimeout(resolve, time);
})

;(async () => {
  const browser = await pp.launch({
    headless: true
  });
  const page = await browser.newPage();
  await page.goto('https://juejin.im/timeline', { waitUntil: 'networkidle2' });

  await sleep(3000);
  let i = await page.waitForSelector('.item')
  let con = await page.evaluate(() => {
    let items = document.querySelectorAll('.item .title');
    return Array.from(items).map((item) => {
      return item.innerHTML
    })
  })

  console.log(con)

  //await browser.close();


})()