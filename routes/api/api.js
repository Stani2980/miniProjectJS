var api = require('express').Router();

var locationBlogRouter = require('./locationBlogApi');
var positionRouter = require('./positionApi');
var userRouter = require('./userApi');
// var graphqlRouter = require('./graphqlApi');

api.use('/locationBlog', locationBlogRouter);
api.use('/position', positionRouter);
api.use('/user', userRouter);
// api.use('/graphql', graphqlRouter);

module.exports = api;