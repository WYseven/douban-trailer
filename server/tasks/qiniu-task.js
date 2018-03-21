const qiniu = require('qiniu');
const nanoid = require('nanoid'); // 随机生成id
const conf = require('../config/config.js');
const { extname } = require('path');
const mongoose = require('mongoose')
const MovieModel = mongoose.model('Movie');

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

// 获取并上传到七牛
const action = async (item) => {
  return new Promise(async (resolve,reject) => {
    if (item.videoUrl && !item.videoUrlKey) {  // key如果不能存在说明没存储过

      try {
        let poster = await fetchResources(item.poster, nanoid() + extname(item.poster));
        let cover = await fetchResources(item.cover, nanoid() + extname(item.cover));
        let videoUrl = await fetchResources(item.videoUrl, nanoid() + extname(item.videoUrl));
        // 添加一个key，key其实是上传后qiniu那边返回的资源名字

        if (!item.posterKey) {
          item.posterKey = poster.key
        }
        if (!item.coverKey) {
          item.coverKey = cover.key
        }
        if (!item.videoUrlKey) {
          item.videoUrlKey = videoUrl.key
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    }else{
      reject();
    }
  })
}

module.exports = async () => {
  return new Promise(async (resolve, reject) => {

    // 测试的资源地址
    const movies = await MovieModel.find({
      $or: [
        {
          videoKey: { $exists: false }

        },
        {
          videoKey: null
        }
      ]
    })
    for (let i = 0; i < movies.length; i++) {
      await action(movies[i]);
      await movies[i].save();
    }

    resolve();
  })
}


