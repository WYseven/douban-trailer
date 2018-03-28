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

// 加载所有的Schema，进行建模
export const initUser = async () => {
  // 同步加载所有的文件
  let userModel = mongoose.model('User');
  let user = await userModel.findOne({
    username: 'admin'
  })

  if (!user){
    let u = new userModel({
      username: 'admin',
      password: '123'
    })
    await u.save();
  }
}

// 测试ref和populate
export const  init = async () => {
  const Schema = mongoose.Schema;
  const ObjectId = Schema.Types.ObjectId;

  let postSchema = {
    title: String,
    users: [{
      type: ObjectId,
      ref: 'UsersTest'
    }]
  }
  let postModel = mongoose.model('post',postSchema);

  let usersTestSchema = {
    name: String
  }
  let userModel = mongoose.model('UsersTest',usersTestSchema);

  let u = new userModel({
    name: 'wang'
  });

  await u.save();

  let p = new postModel({
    title: 'hello',
    users: u
  })

  await  p.save();

  let postModel123 = mongoose.model('post');

  let ps = postModel123.find().populate('users');

  ps.then((data) => {
    console.log(data[1].users);
  })

}





