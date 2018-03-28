
const mongoose = require('mongoose')
let categoryModel = mongoose.model('Category');

export let getCategoryService = async (id) => {
  let query = {};
  let categorys = {};
  
  if(id){
    query._id = id;
    categorys = await categoryModel.find(query).populate('movies');
  }else{
    let c = await categoryModel.find();
    categorys = c.map(item => ({_id:item._id,name:item.name}));
  }
  return categorys;
}
