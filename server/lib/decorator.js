const routers = require('koa-router');
const glob = require('glob');
const { resolve } = require('path')
const routeMap = new Map();
const SymbolPreFix = Symbol('prevFix')


// 这个函数中主要是用来定义一下装饰器函数

export class Route {
  constructor(app, apiPath) {
    this.app = app;
    this.apiPath = apiPath;
    this.router = new routers();
    // 增加一个属性，存放所有的路径
    this.routerPath = {};
  }

  init () {
    // 加载定义路由下所有的js文件
    glob.sync(resolve(this.apiPath,'./**/*.js')).forEach(require);
    // 加载完文件后，开始注册路由
    for (let [conf, controller] of routeMap){
      // 包装成一个数组
      const controllers = Array.isArray(controller) ? controller : [controller];
      const prevFix = conf.target[SymbolPreFix]; // 拿到路由前缀
      if (prevFix) prevFix = normalizePath(prevFix); // 格式话一下
      // 拼上完整的路径
      const routerPath = prevFix + conf.path;
      // 注册路由，形式是 router.get/post(path,callback)
      this.routerPath[prevFix] = this.routerPath[prevFix] || [];
      this.routerPath[prevFix].push(conf.path)
      this.router[conf.method](routerPath, ...controllers)
    }

    // 注册之后，应用，调用router的方法
    this.app.use(this.router.routes()).use(this.router.allowedMethods())
  }
}

// 装饰器

// 修饰路由定义的类，给类的原型上添加上传入的路径
// 修饰器接收一个路径，放在原型上，并且原型上的属性不能重复，定义成Symbol
export const controller = path => target => target.prototype[SymbolPreFix] = path;

// 给path加上相对根路径的/标示
const normalizePath = path => path.startsWith('/') ? path : `/${path}`;

const router = conf => (target, name, des) => {
  conf.path = normalizePath(conf.path);

  // get装饰器方法可能会被调用多次的，需要存路由的信息和对应执行的函数。选择Map数据结构
  routeMap.set({
    target: target,
    ...conf
  }, target[name])
}

export const get = path => router({
  method: 'get',
  path
})
export const post = path => router({
  method: 'post',
  path
})
export const del = path => router({
  method: 'del',
  path
})
export const put = path => router({
  method: 'put',
  path
})
export const use = path => router({
  method: 'use',
  path
})
export const all = path => router({
  method: 'all',
  path
})
