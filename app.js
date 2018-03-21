const koa = require('koa');
const app = new koa();
const { connect, initSchemas, initUser} = require('./server/database/connet')
const { userMiddlewear } = require('./server/utils')

const morgan = require('koa-morgan')
const responseTime = require('koa-response-time')

const middlewears = ['router']; //定义要加载的中间件

app.use(morgan('combined')); // 访问的loger日志
app.use(responseTime())  // 设置响应信息中的响应时间，X-Response-Time:3ms

;(async () => {
  try{
    console.log('正在连接数据库....');
    await connect();
    initSchemas()
    initUser();
    console.log('数据库连接成功');
  }catch(error){
    console.log(error,'出了点问题');
  }

  // 启动爬虫程序,拿到预告片页面的数据
  console.log('预告片页面数据爬取开始....')
  await require('./server/tasks/movie-task')();
  console.log('预告片页面数据爬取完毕!!!')
  // 查找接口，拿到描述和分类
  console.log('查找接口，拿到描述和分类开始....')
  await require('./server/tasks/request-movie-data')();
  console.log('查找接口，拿到描述和分类完毕')
  // 根据电影抓取电影预告片video
  console.log('电影抓取电影预告片video开始...')
  await require('./server/tasks/video-task')()
  console.log('电影抓取电影预告片video完毕')
  // 把预告片部署在七牛服务器上
  console.log('把预告片部署在七牛服务器上开始...')
  await require('./server/tasks/qiniu-task')()
  console.log('把预告片部署在七牛服务器上完毕')

  await userMiddlewear(app, middlewears);
})()

app.listen(4000)