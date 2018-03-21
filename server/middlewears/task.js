
// 是否启动任务
const mongoose = require('mongoose')
const MovieModel = mongoose.model('Movie');

export const task = async () => {
  
  let len = await MovieModel.count();
  // 查找为0条，则启动，抓取
  if(!len){
    // 启动爬虫程序,拿到预告片页面的数据
    console.log('预告片页面数据爬取开始....')
    await require('../../server/tasks/movie-task')();
    console.log('预告片页面数据爬取完毕!!!')
    // 查找接口，拿到描述和分类
    console.log('查找接口，拿到描述和分类开始....')
    await require('../../server/tasks/request-movie-data')();
    console.log('查找接口，拿到描述和分类完毕')
    // 根据电影抓取电影预告片video
    console.log('电影抓取电影预告片video开始...')
    await require('../../server/tasks/video-task')()
    console.log('电影抓取电影预告片video完毕')
    // 把预告片部署在七牛服务器上
    console.log('把预告片部署在七牛服务器上开始...')
    await require('../../server/tasks/qiniu-task')()
    console.log('把预告片部署在七牛服务器上完毕')
  }
  
}