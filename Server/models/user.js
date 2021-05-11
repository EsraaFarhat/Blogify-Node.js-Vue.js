const Joi = require("joi");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  fname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  lname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  age: {
    type: Number,
    minlength: 1,
    maxlength: 100,
  },
  following: {
    type: Array,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      fname: this.fname,
      lname: this.lname,
      email: this.email,
      age: this.age,
      gender: this.gender,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    fname: Joi.string().min(3).max(50).required(),
    lname: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    gender: Joi.string().required(),
    age: Joi.number().min(1).max(100),
  });
  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
