
const { controller, get, post} = require('../lib/decorator');

@controller('api/v0/miaov')
export class miaovCon {
  @get('/')
  async getMiaovUsers(ctx) {
    console.log('访问到了这里')
    ctx.body = 'hello'
  }
  @get('/abc')
  async getMiaovUsers(ctx) {
    console.log('访问到了这里')
    ctx.body = 'hello'
  }
}
@controller('api/v0/leo')
export class miaovCons {
  @get('/')
  async getMiaovUsers(ctx) {
    console.log('访问到了这里')
    ctx.body = 'hello'
  }
  @get('/abc')
  async getMiaovUsers(ctx) {
    console.log('访问到了这里')
    ctx.body = 'hello'
  }
}


