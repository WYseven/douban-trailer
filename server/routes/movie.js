
const { controller, get, post} = require('../lib/decorator');

const {getMovieService} = require('../database/service/movie')

@controller('api/v0/movies')
export class Movies {  
  // 找到所有的电影
  @get('/')
  async getMovies(ctx){
    // 获取指定类型，和年份的电影
    let {type,year,start,count} = ctx.request.query;

    let movies = await getMovieService(type,year,start,count);

    ctx.body = {
      data:movies,
      count: movies.length,
      success: true
    };
  }
}