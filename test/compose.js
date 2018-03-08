const compose = require('koa-compose');

// 

const getData = () => new Promise((resolve, reject) => {
	setTimeout(() => resolve('得到数据'), 2000);
});

async function one(ctx,next){
	console.log('第一个，等待两秒后再进行下一个中间件');
	// 模拟异步读取数据库数据
	await getData()  // 等到获取数据后继续执行下一个中间件
	next()
	// next();
}
function two(ctx,next){
	console.log('第二个');
	next().then(function(){
		console.log('第二个调用then后')
	});
}
function three(ctx,next){
	console.log('第三个');
	next();
}

const middlewares = compose([one, two, three]);

middlewares().then(function (){
	console.log('队列执行完毕');	
})