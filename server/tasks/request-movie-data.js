const rpn = require('request-promise-native');  // request的promise形式
const mongoose = require('mongoose')
const MovieModel = mongoose.model('Movie');

// 根据电影id获取电影的具体信息
async function getMovieData(movieId) {
  let url = `http://api.douban.com/v2/movie/${movieId}`;
  console.log(url)
  return await rpn(url)
}

// 自动开始获取
; (async () => {
  // 从数据库总取出来
  let movies = await MovieModel.findOne({
    $or: [
      {
        summary: {$exists: false},  // 字段没有
      },
      {
        title: ''
      }
    ]
  });
 
  [movies].map(async (item) => {
    let movieData = await getMovieData(item.movieId);

    // 解析数据,可能会出错
    try {
      movieData = JSON.parse(movieData);
      if (movieData) {
        MovieModel.tags = movieData.tags || [];
        MovieModel.summary = movieData.summary || '';
        MovieModel.title = movieData.alt_title || movieData.title;
        MovieModel.rawTitle = movieData.title;

        if (movieData.tags){
          //MovieModel.movieTypes = 
        }
      }
      console.log(movieData.tags)
      console.log(movieData.attrs)
      console.log(movieData.summary)

    } catch (err) {
      console.log(err);
    }

    // 打印拿到数据
    //console.log(movieData)

  })

})()