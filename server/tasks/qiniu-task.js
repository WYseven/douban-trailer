const qiniu = require('qiniu');
const nanoid = require('nanoid'); // 随机生成id
const conf = require('../config/config.js');
const { extname } = require('path');


const bucket = conf.qiniu.bucket;  // 拿到存储空间名
const visitUrl = conf.qiniu.visitUrl; // 线上访问地址

// 鉴权
var mac = new qiniu.auth.digest.Mac(conf.qiniu.AK, conf.qiniu.SK);

var config = new qiniu.conf.Config();
// 资源管理相关的操作首先要构建BucketManager对象：
var bucketManager = new qiniu.rs.BucketManager(mac, config);

// 利用qiniu的API从远程获取资源，封装成Promise

const fetchResources = (url, key) => {
  return new Promise((resolve, reject) => {
    bucketManager.fetch(url, bucket, key, function (err, respBody, respInfo) {
      if (err) {
        //console.log(err);
        reject(err)
        //throw err;
      } else {
        if (respInfo.statusCode == 200) {
          resolve({key: visitUrl + key})
          //console.log(respBody.key);
         // console.log(respBody.hash);
          //console.log(respBody.fsize);
          //console.log(respBody.mimeType);
        } else {
          //console.log(respInfo.statusCode);
          //console.log(respBody);
          reject(respInfo)
        }
      }
    });
  })
}

;(async () => {
  
  // 测试的资源地址
  const movies = [
    {
      movieId: 25755645,
      paster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2189861035.jpg',
      cover: 'https://img1.doubanio.com/img/trailer/medium/2002519377.jpg',
      videoUrl: 'http://vt1.doubanio.com/201803051629/b3e42dc4cfd8a31bd324c4c86b76b69a/view/movie/M/301360300.mp4'
    }

  ]
  
  let qiniuMovies = movies.map(async (item) => {
    if (item.videoUrl && !item.videoUrlKey){  // key如果不能存在说明没存储过

        try{
          let paster = await fetchResources(item.paster, nanoid() + extname(item.paster));
          let cover = await fetchResources(item.cover, nanoid() + extname(item.cover));
          let videoUrl = await fetchResources(item.videoUrl, nanoid() + extname(item.videoUrl));

          // 添加一个key，key其实是上传后qiniu那边返回的资源名字

          if (!item.pasterKey) {
            item.pasterKey = paster.key
          }
          if (!item.coverKey) {
            item.coverKey = cover.key
          }
          if (!item.videoUrlKey) {
            item.videoUrlKey = videoUrl.key
          }
          console.log(item)
        }catch(error){
          console.log(error)
        }
    }
  });

})()