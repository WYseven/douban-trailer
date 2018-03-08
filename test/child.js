const cp = require('child_process');
const {resolve} = require('path');

const fork = cp.fork(resolve(__dirname,'test.js'),[]);


fork.on('message', function (result){
	console.log(result);	
})

fork.send('传过来啦')
