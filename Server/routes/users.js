const auth = require("../middleware/auth");
const { User, validate } = require("../models/user");
const { Blog } = require("../models/blog");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const express = require("express");

const router = express.Router();

router.get("/me", auth, async (req, res, next) => {
  let id = req.user._id;
  const user = await User.findById(id)
    .populate("following")
    .select("_id following");
  res.send(user);
});

router.get("/profile", auth, async (req, res, next) => {
  let id = req.header("id");
  let blogs = await Blog.find({ author: id })
    .populate("author")
    .sort("-createdAt");
  if (blogs.length == 0) {
    const user = await User.findById(id).select("-password");
    res.send(user);
  } else res.send(blogs);
});

router.get("/following", auth, async (req, res, next) => {
  let id = req.user._id;
  const user = await User.findById(id)
    .populate("following")
    .select("following");
  const blogs = await Blog.find({ author: { $in: user.following } })
    .populate("author")
    .sort("-createdAt");
  res.send(blogs);
});

router.post("/", async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered!");

  user = new User(
    _.pick(req.body, ["fname", "lname", "email", "password", "gender", "age"])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const token = user.generateAuthToken();

  await user.save();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "fname", "lname", "email"]));
});

router.patch("/me", auth, async (req, res, next) => {
  let id = req.user._id;
  let oldFollowing = await User.findById(id).select("following");
  let newFollowing = oldFollowing.following;
  let index = newFollowing.indexOf(req.body.id);
  let change = "";

  if (index == -1) {
    newFollowing.push(req.body.id);
    change = "unfollow";
  } else {
    newFollowing.pop(req.body.id);
    change = "follow";
  }

  const user = await User.findByIdAndUpdate(
    id,
    { following: newFollowing },
    { new: true, useFindAndModify: false }
  );

  if (!user) return res.status(400).send("User not found!");

  res.send(change);
});

router.get("/:id", async (req, res, next) => {
  let id = req.params.id;
  const user = await User.findById(id);

  if (!user) return res.status(400).send("User not found!");

  res.send(user);
});

module.exports = router;
