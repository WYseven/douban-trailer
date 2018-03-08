const koa = require('koa');
const app = new koa();
app.use(async (ctx,next) => {
	//ctx.body = 'hello'
	console.log(123)
	next();
	console.log('最后');
})
app.use(async (ctx,next) => {
	//ctx.body = 'hello'
	console.log(456)
	next();
	console.log('最后2');
	ctx.body += 'yun'
})
app.use(ctx => {
	console.log('响应');
	ctx.body = 'hello'
})

app.listen(3000)

exports.miaov1 = function () { console.log('miaov1') }
exports.miaov2 = function () { console.log('miaov1') }
exports.miaov3 = function () { console.log('miaov1') }
