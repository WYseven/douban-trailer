const koa = require('koa');
const app = new koa();
app.use((ctx, next) => {
  console.log('第一个中间件函数')
  next();
  console.log('第一个中间件函数next之后');
})
app.use(async (ctx, next) => {
  console.log('第二个中间件函数')
  next();
  console.log('第二个中间件函数next之后');
})
app.use(ctx => {
  console.log('响应');
  ctx.body = 'hello'
})

app.listen(3000)
