const express = require('express');

const app = express();

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: '3dsfds2342s',
      title: 'post 1',
      content: 'this is some good content'
    },
    {
      id: '3dsfio21213',
      title: 'post 2',
      content: 'this is some good content two'
    }
  ];
  res.status(200).json({
    message: 'posts send successfully',
    posts: posts
  });
});

module.exports = app;
