const http = require('http');

var app = http.createServer(function (req,res){
	return (function (){
		res.end('ok')
	})()
})

app.listen(4000)

