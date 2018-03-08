const koa = require('koa');
const app = new koa();
const { connect, initSchemas} = require('./server/database/connet')
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
    console.log('数据库连接成功');
  }catch(error){
    console.log(error,'出了点问题');
  }

  // 启动爬虫程序,拿到预告片页面的数据
  //require('./server/tasks/movie-task')
  require('./server/tasks/request-movie-data')

  await userMiddlewear(app, middlewears);
})()

app.listen(4000)