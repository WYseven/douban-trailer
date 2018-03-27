
const mongoose = require('mongoose')
let movieModel = mongoose.model('Movie');
export let getMovieService = async (type='',year='',start=0,count=20) => {
  let query = {};
  if(type){
    query.movieTypes = {
      $in: [type]
    }
  }
  if(year){
    query.year = year;
  }
  /*let movies = await movieModel.find(query).sort({
    'meta.createdAt': -1  // 排序
  }).limit(2).skip(0);
    limt 是截取多少条
    skip 是开始的下标

    数据量庞大，有待优化 
    https://cnodejs.org/topic/559a0bf493cb46f578f0a601
  */
   if(count > 20) count = 20;
  let movies = await movieModel.find(query).limit(parseInt(count)).skip(parseInt(start));
  return movies;
}

// 根据id获取相关电影
export let getMovieDetailService = async (id) => {
  let movie = await movieModel.findOne({movieId: id});

  return movie;
}
// 根据电影的movieType获取同类电影
export let getRelativeMovies = async (movie) => {

  if(!movie){
    return []
  }

  let relativeMovies = await movieModel.find({movieTypes: {
    $in: movie.movieTypes
  }});

  return relativeMovies;
}