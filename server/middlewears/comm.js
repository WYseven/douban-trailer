import bodyParser from 'koa-bodyparser'
import session from 'koa-session'
const morgan = require('koa-morgan')
const responseTime = require('koa-response-time')

//app.use(morgan('combined')); // 访问的loger日志
//app.use(responseTime())  // 设置响应信息中的响应时间，X-Response-Time:3ms

export const addBodyParser = app => {
  app.use(bodyParser())
}

export const addSession = app => {
  app.keys = ['wang']

  const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: false, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
  }
  app.use(session(CONFIG, app))
}