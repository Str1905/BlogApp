// require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");


// import file
const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

// define express app
const app = express();
const PORT = 8000;

// mongodb is coonected
mongoose
  .connect('mongodb://127.0.0.1:27017/blogify')
  .then((e) => console.log("MongoDB Connected"));

// set the template engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());


app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// route
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);


// create a server which listen on given port using express app
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
