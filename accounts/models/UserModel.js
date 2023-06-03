const mongoose=require('mongoose');

let UserSchema=new mongoose.Schema({
   //标题
   username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

let UserModel = mongoose.model('user',UserSchema);

module.exports=UserModel;