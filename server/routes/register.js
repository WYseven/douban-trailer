
const { controller, get, post} = require('../lib/decorator');
const {registerCheck,loginCheck} = require('../database/service/userService.js')

@controller('user')
export class miaovCons {
  @post('/register')
  async register(ctx) {
    let {username,email,password} = ctx.request.body;
    let result = await registerCheck(ctx.request.body);
    
    ctx.body = {
      success: result.success,
      mes: result.mes
    };
  }
  @post('/login')
  async login(ctx) {
    let {username,email,password} = ctx.request.body;
    let result = await loginCheck(ctx.request.body);
    ctx.body = {
      success: result.success,
      mes: result.mes
    };
  }
}


