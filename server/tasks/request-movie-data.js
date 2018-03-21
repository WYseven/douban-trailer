const rpn = require('request-promise-native');  // request的promise形式
const mongoose = require('mongoose')
const MovieModel = mongoose.model('Movie');
const CategoryModel = mongoose.model('Category');

// 根据电影id获取电影的具体信息
async function getMovieData(movieId) {
  let url = `http://api.douban.com/v2/movie/${movieId}`;
  return await rpn(url)
}

module.exports = async () => {
  return new Promise(async (resolve, reject) => {
    // 从数据库总取出来
    let movies = await MovieModel.find({
      $or: [
        {
          summary: { $exists: false },  // 字段没有
        },
        {
          title: ''
        }
      ]
    });

    for (let i = 0; i < movies.length; i++){
      let item = movies[i];
      let movieData = await getMovieData(item.movieId);
      // 解析数据,可能会出错
      try {
        movieData = JSON.parse(movieData);
        if (movieData) {
          item.tags = movieData.tags || [];
          item.summary = movieData.summary || '';
          item.title = movieData.alt_title || movieData.title;
          item.rawTitle = movieData.title;
          item.movieTypes = movieData.attrs.movie_type || [];


          for (let i = 0; i < item.movieTypes.length; i++) {
            let typeName = item.movieTypes[i];
            let categoty = await CategoryModel.findOne({
              name: typeName
            });
            if (!categoty) {  // 说明没有此分类，需要添加
              categoty = new CategoryModel({
                name: typeName,
                movies: [item._id]
              })
            } else {
              if (categoty.movies.indexOf(item._id) === -1) {
                categoty.movies.push(item._id);
              }
            }

            await categoty.save();

            // 每一个电影是否有分类
            if (!item.category) {
              item.category = [categoty._id]
            } else {

              if (item.category.findIndex(o => o.type === categoty._id) === -1) {
                item.category.push(categoty._id)
              }
            }

          }

          await item.save();
        }

      } catch (err) {
        reject(err)
      }
    }
    resolve('ok')
  })
}
