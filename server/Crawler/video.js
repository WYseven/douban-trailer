
// 到详情页开始爬视频，拿到视频的地址和封面图

// 详情页基础地址
const base = `https://movie.douban.com/subject/`

const movieId = 20376577

// 视频播放页地址
const videoBase = `https://movie.douban.com/trailer/136300/#content`

const sleep = time => new Promise((resolve) => {
  setTimeout(resolve, time);
})

const pp = require('puppeteer');

; (async () => {
  console.log('开始爬取目标页面')
  const browser = await pp.launch();

  const page = await browser.newPage();

  await page.goto(base + movieId, {
    waitUntil: 'networkidle2'  // 页面空闲加载完毕
  });

  await sleep(1000)
  
  // 获取页面内容，在页面中执行脚本

  const result = await page.evaluate(() => {
    var $ = window.$;
    var links = $('.related-pic-video');  // 播放视频的封面元素
    var cover = links.find('img').attr('src'); // 封面图
    var link = links.attr('href');  // 视频播放页地址

    return {
      cover,
      link
    }
  })

  // 拿到视频播放页后，去找视频
  if (result.link) {
    // 到新的页面---视频播放页
    await page.goto(result.link, {
      waitUntil: 'networkidle2'  // 页面空闲加载完毕
    });

    await sleep(2000);

    // 执行脚本
    const videoUrl = await page.evaluate(() => {
      var $ = window.$;
      var source = $('source'); // 判断是否有视频
      if ($('source').length > 0){
        return $('source').attr('src')
      }
      return '';
    })

    result.videoUrl = videoUrl;
  }

  let data = {
    movieId,  // 电影id
    videoUrl: result.videoUrl,  // 预告片地址
    cover: result.cover // 封面图
  }


  // 爬到的数据
  //console.log(result)

  await browser.close();  // 关闭浏览器

  // 作为子进程的脚本运行，运行后发送给主进程数据
  process.send(data);
  // 退出子进程
  process.exit(0);

})()