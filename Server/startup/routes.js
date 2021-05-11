const express = require("express");

const cors = require("cors");
const blogs = require("../routes/blogs");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(cors());
  app.use("/uploads", express.static("uploads"));
  app.use("/api/blogs", blogs);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  app.use(error);
};
