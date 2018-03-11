const rpn = require('request-promise-native');  // request的promise形式
const mongoose = require('mongoose')
const MovieModel = mongoose.model('Movie');
const CategoryModel = mongoose.model('Category');

// 根据电影id获取电影的具体信息
async function getMovieData(movieId) {
  let url = `http://api.douban.com/v2/movie/${movieId}`;
  console.log(url)
  return await rpn(url)
}

// 自动开始获取
; (async () => {
  // 从数据库总取出来
  let movie = await MovieModel.find({
    $or: [
      {
        summary: {$exists: false},  // 字段没有
      },
      {
        title: ''
      }
    ]
  });
 
  [movie[0],movie[1],movie[2],].map(async (item) => {
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
        

        for(let i = 0; i < item.movieTypes.length; i++){
          let typeName = item.movieTypes[i];
          let categoty = await CategoryModel.findOne({
            name: typeName
          });
          if(!categoty){  // 说明没有此分类，需要添加
            categoty = new CategoryModel({
              name: typeName,
              movies: [item._id]
            })
          }else{
            if(categoty.movies.indexOf(item._id) === -1){
              categoty.movies.push(item._id);
            }
          }

          await categoty.save();

          // 每一个电影是否有分类
          if(!item.category){
            item.category = [{
              type:categoty._id,
              name: typeName
            }]
          }else{
            if(item.category.findIndex(option => option.type === categoty._id) === -1){
              item.category.push({
                type:categoty._id,
                name: typeName
              })
            }
          }

        }

        await item.save();
      }

    } catch (err) {
      console.log(err);
    }
  })

})()