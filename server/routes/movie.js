
const { controller, get, post,test} = require('../lib/decorator');

const {getMovieService,getMovieDetailService,getRelativeMovies} = require('../database/service/movie')

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

  // 根据id找到关于id的细节
  // 相关电音列表
  @get('/:id')
  async getMovieDetail(ctx){
    let id = ctx.params.id;
    
    let movie = await getMovieDetailService(id);
    let relativeMovies = await getRelativeMovies(movie);
    
    ctx.body = {
      movie,
      relativeMovies,
      success: true
    }
  }
}

