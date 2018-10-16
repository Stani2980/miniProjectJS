var api = require('express').Router();

var locationBlogRouter = require('./locationBlogApi');
// var positionRouter = require('./positionApi');
var userRouter = require('./userApi');

api.use('/locationBlog', locationBlogRouter);
// api.use('/position', positionRouter);
api.use('/user', userRouter);

module.exports = api;