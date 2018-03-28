// 在这里开启一个子进程，跑抓取数据的代码
// 为了主进程稳定，可以再开启一个子进程去做爬虫，即便是子进程挂掉，主进程还依然健在
const cp = require('child_process');
const { resolve } = require('path'); // 拼写地址的方法
const mongoose = require('mongoose')
const MovieModel = mongoose.model('Movie');
let taskFile = resolve(__dirname, '../Crawler/hot-list');  // 相对当前文件的上层目录下的脚本

// 自动执行

module.exports = async () => {
  return new Promise(async (resolve,reject) => {
    const child = cp.fork(taskFile, []); // 开始跑脚本，返回一个子进程的对象

    // 拿到子进程跑完后发送过来的通信数据
    child.on('message', async (data) => {
      // 把抓取的代码入库
      for(let i = 0; i < data.length; i++){
        let item = data[i];
        let movieItem = await MovieModel.findOne({ movieId: item.movieId });
        if (!movieItem) {
          movieItem = new MovieModel(item);
          movieItem.hot = 'hot';
          await movieItem.save();
        }
      }
      resolve('ok')
    })

    // 监控退出
    child.on('exit', (code) => {
      console.log('退出了', code)
      
    })
  })
}
