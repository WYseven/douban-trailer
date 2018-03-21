
const { controller, get, post} = require('../lib/decorator');

@controller('user')
export class miaovCons {
  @post('/register')
  async register(ctx) {
    console.log(ctx.request.body)
    ctx.body = 'hello'
  }
  @get('/test')
  async test(ctx) {
    ctx.body = 'hello:'+ctx.session.user
  }
  @get('/login')
  async login(ctx) {
    let {name} = ctx.request.query;
    let n = ctx.session.views || 0;
    ctx.session.views = ++n;
    ctx.session.user = name;
    ctx.body = n + ' views' + ctx.session.user;
  }
}


