const glob = require('glob');
const { resolve } = require('path');
console.log(resolve(__dirname , './**/*.js'))

// 找到文件下所有的文件
glob.sync(resolve(__dirname,'./**/*.js'),).forEach(function (item) {
  console.log(item)
})