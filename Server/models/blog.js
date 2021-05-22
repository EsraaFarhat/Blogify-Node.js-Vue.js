const Joi = require("joi");
const mongoose = require("mongoose");
const { User } = require("./user");

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
  },
  blogImage: String,
  tags: {
    type: [
      {
        type: String,
      },
    ],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
  },
});
blogSchema.index({ "$**": "text" });
const Blog = mongoose.model("Blog", blogSchema);

function validateBlog(blog) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    body: Joi.string().min(3).required(),
    blogImage: Joi.string().allow(''),
    tags: Joi.array(),
  });
  return schema.validate(blog);
}

module.exports.Blog = Blog;
module.exports.validate = validateBlog;
