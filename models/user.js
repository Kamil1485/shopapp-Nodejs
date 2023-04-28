const mongoose = require("mongoose");
const Joi = require("joi");
const jwt=require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    //*2
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // unique:true,
    },
    password: {
      type: String,
      required: true,
    },
   isAdmin:{
    type:Boolean
   }
  },
  { timestamps: true }
); //createdat ve updatedat sütünu ekler

function validateRegister(user) {//kullanıcı giriş kurallarına uygun veri girdimi kontrolü
  const schema = new Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(5).max(15).required(),
    isAdmin:Joi.boolean(),
  });

  return schema.validate(user);
}

function validateLogin(user) {//kullanıcı giriş kurallarına uygun veri girdimi kontrolü
    const schema = new Joi.object({
      email: Joi.string().min(3).max(30).required(),
      password: Joi.string().min(5).max(15).required(),
    });
    return schema.validate(user);
  }

userSchema.methods.createAuthToken=function(){
const decodedToken= jwt.sign({_id:this._id,name:this.name,isAdmin:this.isAdmin},"jwtPrivateKey")//createAuthToken metodu her user objesi eriştiğinde kendi verileriyle işlem yapılır.
return decodedToken;
}

const User = mongoose.model("User", userSchema); //*3

module.exports = { User, validateRegister,validateLogin };
