// 定义一些中间件

const {Route} = require('../lib/decorator');
const { resolve } = require('path');

export const router = app => {
  let apiPath = resolve(__dirname, '../routes');  // 路由存放的文件夹路径
  let router = new Route(app, apiPath);  
  // 初始化路由，内部回家再apiPath下的路由文件
  router.init();

  console.log(router.routerPath)
}