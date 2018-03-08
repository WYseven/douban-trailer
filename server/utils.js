const R = require('ramda');
const { resolve } = require('path');
// 用来加载中间件
export const userMiddlewear = (app, middlewears) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      (name) => resolve(__dirname, `./middlewears/${name}`)
    )
  )(middlewears)
}