const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect(
  `mongodb+srv://arjan:${process.env.MONGO_ATLAS_PASSWORD}@mymessages-q6n2y.mongodb.net/node-angular?retryWrites=true&w=majority`,
  // added due to deprication warning
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("connection failed!")
  });

// for parsing json data, body is stream of bits initially
app.use(bodyParser.json());
// not used here, but you can parse urlencoded data too
app.use(bodyParser.urlencoded({extended: false}));
// express.static allows requests to acess all images
// path is used to forward request to /backend/images
app.use('/images', express.static(path.join('images')))

app.use((req, res, next) => {
  // for CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept, Authorization"
  );
  // for allowed methods
  // OPTIONS is set implicitely by angular to check if
  // post request is valid
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
