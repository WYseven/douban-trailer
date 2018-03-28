
const { controller, get, post,test} = require('../lib/decorator');

const {getCategoryService} = require('../database/service/category')

@controller('api/v0/category')
export class Movies {  
  // 找到所有的分类
  @get('/:id?')
  async getCategory(ctx){
    let id = ctx.params.id;
    let categorys = await getCategoryService(id);
    ctx.body = {
      data:categorys,
      count: categorys.length,
      success: true
    };
  }
}

