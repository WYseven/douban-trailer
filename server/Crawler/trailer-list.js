const url = `https://movie.douban.com/tag/#/?sort=T&range=0,6&tags=`

const sleep = time => new Promise((resolve) => {
  setTimeout(resolve, time);
})

const pp = require('puppeteer');

;(async () => {
  console.log('开始爬取目标页面')
  const browser = await pp.launch();

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: 'networkidle2'  // 页面空闲加载完毕
  });

  await sleep(3000)

  await page.waitForSelector('.more');  // 等待出现某个元素

  // 点击按钮n次
  for(var i = 0; i < 3; i++){
    await sleep(1000);
    await page.click('.more'); // 点击更多
  }

  // 获取页面内容，在页面中执行脚本

  const result = await page.evaluate(() => {
    var $ = window.$;
    var links = $('.list-wp a');

    return Array.from(links).map((item) => {
      var title = $(item).find('.title').text();
      var rate = +($(item).find('.rate').text());
      var movieId = $(item).find('div').data('id');
      var paster = $(item).find('img').attr('src').replace('s_ratio_poster', 'l_ratio_poster');
      return {
        title,
        rate,
        movieId,
        paster
      }
    })

  })


  // 爬到的数据
  console.log(result)

  await browser.close();  // 关闭浏览器

  // 作为子进程的脚本运行，运行后发送给主进程数据
  process.send(result);
  // 退出子进程
  process.exit(0);

})()