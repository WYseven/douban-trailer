const koa = require('koa');
const app = new koa();
const { connect, initSchemas, initUser} = require('./server/database/connet')
const { userMiddlewear } = require('./server/utils')

const middlewears = ['comm','router','task']; //定义要加载的中间件


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
  
  await userMiddlewear(app, middlewears);
})()

app.listen(4000, () => {
  console.log('启动了应用：4000')
})