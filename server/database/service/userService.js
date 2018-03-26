
const mongoose = require('mongoose')
const UserModel = mongoose.model('User');

// 注册验证
export let registerCheck = async ({username='',email='',password=''}) => {
  
  let empty = isEmpty({username,email,password});

  if(!empty.success){
    return empty;
  }

  // 到数据库查找
  let user = await UserModel.findOne({username});

  if(user){
    return {
      user,
      success: false,
      mes: '用户名已存在'
    }
  }
  let emailUser = await UserModel.findOne({email});

  if(user){
    return {
      success: false,
      mes: '邮箱已存在，请登录'
    }
  }


  let newUser = await UserModel.create({username,email,password});

  await newUser.save();

  return {
    user:newUser,
    success: true,
    mes: '注册成功'
  }

}

// 登录验证

export let loginCheck = async ({username='',email='',password=''}) => {
  let empty = isEmpty({username,email,password});

  if(!empty.success){
    return empty;
  }

  let user = await UserModel.findOne({username,email});
  let isPassword = user ? await (new UserModel).comparePassword(password,user.password) : false;
  if(user && isPassword){
    return {
      user:user,
      success: true,
      mes: '登录成功'
    }
  }else{
    return {
      user:user,
      success: false,
      mes: '用户名或邮箱或密码出错'
    }
  }
  

}

// 登录注册为空的验证

let isEmpty = ({username='',email='',password=''}) => {
  if(!username.trim()) {
    return {
      success: false,
      mes: '用户名不能为空'
    }
  }
  if(!email.trim()) {
    return {
      success: false,
      mes: '邮箱不能为空或邮箱格式有问题'
    }
  }
  if(!password.trim()) {
    return {
      success: false,
      mes: '密码不能为空'
    }
  }

  return {
    success: true,
    mes: '都不为空'
  };
}