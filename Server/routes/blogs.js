const auth = require("../middleware/auth");
const { Blog, validate } = require("../models/blog");
const { User } = require("../models/user");

const Joi = require("joi");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(
      new Error("Unsupported image type .. should be [jpg - jpeg - png]"),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

router.get("/", async (req, res, next) => {
  const blogs = await Blog.find().populate("author").sort("-createdAt");
  res.send(blogs);
});

router.post("/", [auth, upload.single("blogImage")], async (req, res, next) => {
  let tags = req.body.tags.split(",");
  if (tags[0] == "") tags = [];
  req.body.tags = tags;

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findById(req.user._id).select("_id");

  const blog = new Blog({
    title: req.body.title,
    body: req.body.body,
    blogImage: req.body.blogImage,
    tags: tags,
    author: user,
    createdAt: Date.now(),
  });
  await blog.save();
  res.send(blog);
});

router.put("/:id", auth, async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let id = req.params.id;
  const user = await User.findById(req.user._id).select({ _id: 1 });
  const blog = await Blog.findById(id).select({ author: 1 });
  const img = {
    data: req.body.img.data,
    contentType: req.body.img.contentType,
  };

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
});

router.patch(
  "/:id",
  [auth, upload.single("blogImage")],
  async (req, res, next) => {
    let tags = req.body.tags.split(",");
    if (tags[0] == "") tags = [];
    req.body.tags = tags;

    const { error } = patchValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let id = req.params.id;
    let changes = req.body;
    let newTitle = "";
    let newBody = "";
    let newImage = "";
    let newTags = [];

    const user = await User.findById(req.user._id).select({ _id: 1 });
    const blog = await Blog.findById(id);

    if (changes.title) newTitle = changes.title;
    else newTitle = blog.title;

    if (changes.body) newBody = changes.body;
    else newBody = blog.body;

    if (changes.blogImage) newImage = changes.blogImage;
    else newImage = blog.blogImage;

    if (changes.tags) newTags = changes.tags;
    else newTags = blog.tags;

    if (user._id.equals(blog.author._id)) {
      const blog = await Blog.findByIdAndUpdate(
        id,
        {
          title: newTitle,
          body: newBody,
          blogImage: newImage,
          tags: newTags,
        },
        { new: true, useFindAndModify: false }
      );

      if (!blog) return res.status(404).send("Blog not found");

      res.send(blog);
    } else {
      res.status(400).send("You don't have the privilege to edit this post.");
    }
  }
);

router.delete("/:id", auth, async (req, res, next) => {
  let id = req.params.id;
  const user = await User.findById(req.user._id).select({ _id: 1 });
  const blog = await Blog.findById(id).select({ author: 1 });

  if (user._id.equals(blog.author._id)) {
    const blog = await Blog.findByIdAndRemove(id, {
      useFindAndModify: false,
    });

    if (!blog) return res.status(404).send("Blog not found");

    res.send(blog);
  } else {
    res.status(400).send("You don't have the privilege to edit this post.");
  }
});

router.get("/:id", auth, async (req, res, next) => {
  let user_id = req.user._id;
  let id = req.params.id;

  const blog = await Blog.findById(id).populate("author");

  if (!blog) return res.status(404).send("Blog not found");
  if (blog.author._id.equals(user_id) == false)
    res.status(401).send("Access denied.");

  res.send(blog);
});

router.get("/search/:key", auth, async (req, res, next) => {
  let key = req.params.key;

  const blogs = await Blog.find({
    $or: [
      { title: new RegExp(key) },
      { body: new RegExp(key) },
      { tags: new RegExp(key) },
    ],
  })
    .populate("author")
    .sort("-createdAt");

  if (blogs.length == 0) return res.status(404).send("Blog not found");

  res.send(blogs);
});

function patchValidate(blog) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100),
    body: Joi.string().min(3),
    blogImage: Joi.string(),
    tags: Joi.array(),
  });
  return schema.validate(blog);
}

module.exports = router;
