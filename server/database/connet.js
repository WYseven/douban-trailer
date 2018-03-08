const mongoose = require('mongoose');
const { database, mongodUrl } = require('./config');  //获取配置的json文件
const glob = require('glob');
const { resolve} = require('path');
mongoose.Promise = global.Promise;

let db = mongodUrl + database

export const connect = async () => {
  if(process.env.NODE_ENV !== 'production'){  // 不是生产环境，则开启调试
    mongoose.set('debug',true);
  }
  
  return new Promise((resolve,reject) => {

    mongoose.connect(db);

    mongoose.connection.on('disconnected', (error) => {
      reject(error)
    })
    mongoose.connection.on('error', (err) => {
      reject(err)
    })
    mongoose.connection.once('open', resolve)
  })
}

// 加载所有的Schema，进行建模
export const initSchemas = async () => {
  // 同步加载所有的文件
  
  glob.sync(resolve(__dirname, './schema/**/*.js')).forEach(require)
}