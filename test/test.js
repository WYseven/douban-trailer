for( var i = 0; i < 1234; i++ ){
	
}

process.on('message',function (m){
	console.log(m);
})

setTimeout(function (){
	console.log('执行完成');
	process.send('ok');
	process.exit(0)	
},2000)
process.send('ok');