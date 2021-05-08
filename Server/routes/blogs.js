const auth = require("../middleware/auth");
const { Blog, validate } = require("../models/blog");
const { User } = require("../models/user");

const Joi = require('joi');
const express = require("express");
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file , cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file , cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' ){
    cb(null, true);
  }else{
    cb(new Error('Unsupported image type .. should be [jpg - jpeg - png]'), false);
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});


router.get("/", async (req, res) => {
  const blogs = await Blog.find().populate('author').sort('-createdAt');
  res.send(blogs);
});

router.post("/", [auth, upload.single('blogImage')], async (req, res) => {
  let tags = req.body.tags.split(',');
  if(tags[0] == '') tags = [];
  req.body.tags = tags;

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // const user = await User.findById(req.user._id).select({ email: 1, fname:1, lname:1, _id: -1 });
  const user = await User.findById(req.user._id).select('_id');


  const blog = new Blog({
    title: req.body.title,
    body: req.body.body,
    blogImage: req.file == undefined ? null : req.file.path,
    tags: tags,
    author: user,
    createdAt: Date.now()
  });
  try {
    await blog.save();
    res.send(blog);
  } catch (ex) {
    console.log(ex.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let id = req.params.id;
  try {
    const user = await User.findById(req.user._id).select({ _id: 1 });
    const blog = await Blog.findById(id).select({ author: 1 });
    const img = {data: req.body.img.data, contentType: req.body.img.contentType};

    if (user._id.equals(blog.author._id)) {
      const blog = await Blog.findByIdAndUpdate(
        id,
        {
          title: req.body.title,
          body: req.body.body,
          img: img,
          tags: req.body.tags,
        },
        { new: true, useFindAndModify: false }
      );

      if (!blog) return res.status(404).send("Blog not found");

      res.send(blog);
    } else {
      res.status(400).send("You don't have the privilege to edit this post.");
    }
  } catch (ex) {
    console.error(ex.message);
    res.status(404).send("Blog not found");
  }
});

router.patch("/:id", auth, async (req, res) => {
    const { error } = patchValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    let id = req.params.id;
    let changes = req.body;
    let newTitle = "";
    let newBody = "";
    let newTags = [];

    try {
      const user = await User.findById(req.user._id).select({ _id: 1 });
      const blog = await Blog.findById(id);


      if(changes.title) newTitle = changes.title;
      else newTitle = blog.title;

      if(changes.body) newBody = changes.body;
      else newBody = blog.body;
  
      if(changes.tags) newTags = changes.tags;
      else newTags = blog.tags;
  
  
      if (user._id.equals(blog.author._id)) {
        const blog = await Blog.findByIdAndUpdate(
          id,
          {
            title: newTitle,
            body: newBody,
            tags: newTags,
          },
          { new: true, useFindAndModify: false }
        );
  
        if (!blog) return res.status(404).send("Blog not found");
  
        res.send(blog);
      } else {
        res.status(400).send("You don't have the privilege to edit this post.");
      }
    } catch (ex) {
      console.error(ex.message);
      res.status(404).send("Blog not found");
    }
  });

router.delete("/:id", auth, async (req, res) => {
  let id = req.params.id;
  try{
      const user = await User.findById(req.user._id).select({ _id: 1 });
      const blog = await Blog.findById(id).select({ author: 1 });
    
      if (user._id.equals(blog.author._id)) {
        const blog = await Blog.findByIdAndRemove(id, { useFindAndModify: false });
    
        if (!blog) return res.status(404).send("Blog not found");
    
        res.send(blog);
      } else {
        res.status(400).send("You don't have the privilege to edit this post.");
      }
  } catch (ex) {
    console.error(ex.message);
    res.status(404).send("Blog not found");
  }
});

router.get("/:text", async (req, res) => {
  let text = req.params.text;
  // const user = await User.findById(req.user._id).select('_id');
  let regex= new RegExp(".*"+text+".*$");
  // let fname = author.fname;
const blogs = await Blog.find({ $or: [{title: new RegExp(text) }, {body: new RegExp(text) }, {tags: new RegExp(text) }]}).populate('author');

  if (blogs.length == 0) return res.status(404).send("Blog not found");

  res.send(blogs);
});

router.get("/profile", auth, async (req, res) => {

// const id = req.query.id;
//   if(id == 'me') {
//     let blogs = await Blog.find({author: req.user._id}).populate('author').sort('-createdAt');
//   }
//   else {
//     let blogs = await Blog.find().populate('author').sort('-createdAt');
//   }
//   res.send(blogs);
});

function patchValidate(blog){
    const schema = Joi.object({
        title: Joi.string().min(3).max(100),
        body: Joi.string().min(3),
        tags: Joi.array()
    });
    return schema.validate(blog);
}

module.exports = router;
