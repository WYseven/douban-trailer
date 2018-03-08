const R = require('ramda');

let arr = [1,2,3];

let newArr = R.map((x) => x * 2)(arr)


console.log(newArr)

function one(x) {
  console.log(x)
}

function two(x) {
  console.log(x)
  return __dirname+'/app.js';
}
// 从右向左执行，右边的输出就是左边的输入
R.map(R.compose(R.forEachObjIndexed(initApp => initApp()), require, two))(arr)
