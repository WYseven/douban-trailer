const koa = require('koa'); 
const Router = require('koa-router');

let app = new koa();
let router = new Router();

router.get('/', (ctx, next) => {
  ctx.body = 'hello';
  next();
})

router.get('/all', (ctx, next) => {
  ctx.body = 'all';
  next();
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(5000)