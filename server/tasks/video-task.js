// 在这里开启一个子进程，跑抓取数据的代码
// 为了主进程稳定，可以再开启一个子进程去做爬虫，即便是子进程挂掉，主进程还依然健在
const cp = require('child_process');
const { resolve } = require('path'); // 拼写地址的方法
const mongoose = require('mongoose')
const MovieModel = mongoose.model('Movie');

let taskFile = resolve(__dirname, '../Crawler/video');  // 相对当前文件的上层目录下的脚本

module.exports = async () => {
  return new Promise(async (resolve, reject) => {

    // 拿到电影预告片
    let movies = await MovieModel.find({
      '$or': [
        {
          video: { '$exists': false }
        },
        {
          video: null
        }
      ]
    });
    const child = cp.fork(taskFile, []); // 开始跑脚本，返回一个子进程的对象

    // 监控退出
    child.on('exit', (code) => {
      console.log('退出了', code)
      resolve(code);
    })

    // 拿到子进程跑完后发送过来的通信数据
    child.on('message', async (data) => {
      let { movieId } = data;
      // 拿到值后，取数据库中查找
      let item = await MovieModel.findOne({ movieId });
      if (data.videoUrl) {  // 预告片存在
        item.videoUrl = data.videoUrl
        item.cover = data.cover
        await item.save();
      } else {
        await item.remove();
      }
    })


    // 向子进程发送方数据
    child.send(movies)

  })
}
